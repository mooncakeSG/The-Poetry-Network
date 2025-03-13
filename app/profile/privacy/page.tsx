"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PrivacySettingsForm } from '@/components/privacy-settings'
import { PrivacySettingsSkeleton } from '@/components/privacy-settings-skeleton'
import { PrivacySettings } from '@/types/privacy'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function PrivacySettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<PrivacySettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchSettings = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}/privacy`)
          if (response.ok) {
            const data = await response.json()
            setSettings(data)
          } else {
            toast.error('Failed to load privacy settings')
          }
        } catch (error) {
          console.error('Error fetching privacy settings:', error)
          toast.error('Failed to load privacy settings')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchSettings()
  }, [session?.user?.id])

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <PrivacySettingsSkeleton />
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load privacy settings</h2>
            <p className="text-gray-600">Please try refreshing the page or contact support if the issue persists.</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PrivacySettingsForm
            initialSettings={settings}
            onSave={(updatedSettings) => {
              setSettings(updatedSettings)
            }}
          />
        </motion.div>
      </div>
    </div>
  )
} 