'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export default function EditProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    website: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      facebook: '',
      linkedin: '',
    },
    preferences: {
      emailNotifications: true,
      publicProfile: true,
      showLocation: true,
    },
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}/profile`)
          if (response.ok) {
            const data = await response.json()
            setFormData(prev => ({
              ...prev,
              name: data.name || '',
              bio: data.bio || '',
              location: data.location || '',
              website: data.website || '',
              socialLinks: data.socialLinks || prev.socialLinks,
              preferences: data.preferences || prev.preferences,
            }))
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
          toast.error('Failed to load profile data')
        }
      }
    }

    fetchProfile()
  }, [session?.user?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/users/${session?.user?.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Profile updated successfully')
        router.push('/profile')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSocialLinkChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }))
  }

  const handlePreferenceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked,
      },
    }))
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Your location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <Input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Your website"
            />
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Social Links</h2>
            <div className="space-y-4">
              <Input
                name="twitter"
                value={formData.socialLinks.twitter}
                onChange={handleSocialLinkChange}
                placeholder="Twitter URL"
              />
              <Input
                name="instagram"
                value={formData.socialLinks.instagram}
                onChange={handleSocialLinkChange}
                placeholder="Instagram URL"
              />
              <Input
                name="facebook"
                value={formData.socialLinks.facebook}
                onChange={handleSocialLinkChange}
                placeholder="Facebook URL"
              />
              <Input
                name="linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleSocialLinkChange}
                placeholder="LinkedIn URL"
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.preferences.emailNotifications}
                  onChange={handlePreferenceChange}
                  className="rounded border-gray-300"
                />
                <span>Email notifications</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="publicProfile"
                  checked={formData.preferences.publicProfile}
                  onChange={handlePreferenceChange}
                  className="rounded border-gray-300"
                />
                <span>Public profile</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="showLocation"
                  checked={formData.preferences.showLocation}
                  onChange={handlePreferenceChange}
                  className="rounded border-gray-300"
                />
                <span>Show location</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/profile')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
} 