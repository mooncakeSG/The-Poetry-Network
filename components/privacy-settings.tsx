import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { PrivacySettings } from '@/types/privacy';
import { PrivacyPreview } from '@/components/privacy-preview';
import { ContentPrivacySettingsForm } from '@/components/content-privacy-settings';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacySettingsFormProps {
  initialSettings: PrivacySettings;
  onSave: (settings: PrivacySettings) => void;
}

export function PrivacySettingsForm({ initialSettings, onSave }: PrivacySettingsFormProps) {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<PrivacySettings>(initialSettings);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!session?.user?.id) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/users/${session.user.id}/privacy`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save privacy settings');
      }

      onSave(settings);
      toast.success('Privacy settings updated successfully');
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast.error('Failed to save privacy settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Privacy Settings</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Profile Visibility</h3>
            <RadioGroup
              value={settings.profileVisibility}
              onValueChange={(value) => setSettings({ ...settings, profileVisibility: value as 'public' | 'followers' | 'private' })}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">Public - Anyone can view your profile</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="followers" id="followers" />
                <Label htmlFor="followers">Followers Only - Only your followers can view your profile</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">Private - Only you can view your profile</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Interaction Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="comments">Allow Comments</Label>
                  <p className="text-sm text-gray-600">Let others comment on your content</p>
                </div>
                <Switch
                  id="comments"
                  checked={settings.allowComments}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowComments: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="likes">Allow Likes</Label>
                  <p className="text-sm text-gray-600">Let others like your content</p>
                </div>
                <Switch
                  id="likes"
                  checked={settings.allowLikes}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowLikes: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="follows">Allow Follows</Label>
                  <p className="text-sm text-gray-600">Let others follow your profile</p>
                </div>
                <Switch
                  id="follows"
                  checked={settings.allowFollows}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowFollows: checked })}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email">Show Email</Label>
                  <p className="text-sm text-gray-600">Display your email address on your profile</p>
                </div>
                <Switch
                  id="email"
                  checked={settings.showEmail}
                  onCheckedChange={(checked) => setSettings({ ...settings, showEmail: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="location">Show Location</Label>
                  <p className="text-sm text-gray-600">Display your location on your profile</p>
                </div>
                <Switch
                  id="location"
                  checked={settings.showLocation}
                  onCheckedChange={(checked) => setSettings({ ...settings, showLocation: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="website">Show Website</Label>
                  <p className="text-sm text-gray-600">Display your website on your profile</p>
                </div>
                <Switch
                  id="website"
                  checked={settings.showWebsite}
                  onCheckedChange={(checked) => setSettings({ ...settings, showWebsite: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="socialLinks">Show Social Links</Label>
                  <p className="text-sm text-gray-600">Display your social media links on your profile</p>
                </div>
                <Switch
                  id="socialLinks"
                  checked={settings.showSocialLinks}
                  onCheckedChange={(checked) => setSettings({ ...settings, showSocialLinks: checked })}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Content Privacy</h3>
            <div className="space-y-8">
              <ContentPrivacySettingsForm
                title="Poems"
                description="Control who can view and interact with your published poems"
                settings={settings.poemsPrivacy}
                onChange={(newSettings) => setSettings({ ...settings, poemsPrivacy: newSettings })}
              />

              <ContentPrivacySettingsForm
                title="Drafts"
                description="Control who can view and interact with your draft poems"
                settings={settings.draftsPrivacy}
                onChange={(newSettings) => setSettings({ ...settings, draftsPrivacy: newSettings })}
              />

              <ContentPrivacySettingsForm
                title="Workshops"
                description="Control who can view and interact with your workshops"
                settings={settings.workshopsPrivacy}
                onChange={(newSettings) => setSettings({ ...settings, workshopsPrivacy: newSettings })}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <PrivacyPreview settings={settings} user={session?.user as any} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 