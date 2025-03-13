import { Card } from "@/components/ui/card"
import { PrivacySettings } from "@/types/privacy"
import { User } from "@prisma/client"
import { motion } from "framer-motion"

interface PrivacyPreviewProps {
  settings: PrivacySettings
  user: User
}

export function PrivacyPreview({ settings, user }: PrivacyPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Profile Preview</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
            <div>
              <h4 className="font-medium">{user.name}</h4>
              {settings.showEmail && (
                <p className="text-sm text-gray-600">{user.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {settings.showLocation && user.location && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">📍</span>
                {user.location}
              </div>
            )}
            {settings.showWebsite && user.website && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">🌐</span>
                {user.website}
              </div>
            )}
            {settings.showSocialLinks && user.socialLinks && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">🔗</span>
                {user.socialLinks}
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="mr-1">👥</span>
                {settings.profileVisibility === 'public' && 'Public Profile'}
                {settings.profileVisibility === 'followers' && 'Followers Only'}
                {settings.profileVisibility === 'private' && 'Private Profile'}
              </div>
              <div className="flex items-center">
                <span className="mr-1">💬</span>
                {settings.allowComments ? 'Comments Enabled' : 'Comments Disabled'}
              </div>
              <div className="flex items-center">
                <span className="mr-1">❤️</span>
                {settings.allowLikes ? 'Likes Enabled' : 'Likes Disabled'}
              </div>
              <div className="flex items-center">
                <span className="mr-1">👋</span>
                {settings.allowFollows ? 'Follows Enabled' : 'Follows Disabled'}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Content Privacy</h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Poems</span>
                  <span className="text-gray-600">
                    {settings.poemsPrivacy.visibility === 'public' && 'Public'}
                    {settings.poemsPrivacy.visibility === 'followers' && 'Followers Only'}
                    {settings.poemsPrivacy.visibility === 'private' && 'Private'}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                  {settings.poemsPrivacy.allowComments && '💬 Comments'}
                  {settings.poemsPrivacy.allowLikes && '❤️ Likes'}
                  {settings.poemsPrivacy.allowShares && '🔄 Shares'}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Drafts</span>
                  <span className="text-gray-600">
                    {settings.draftsPrivacy.visibility === 'public' && 'Public'}
                    {settings.draftsPrivacy.visibility === 'followers' && 'Followers Only'}
                    {settings.draftsPrivacy.visibility === 'private' && 'Private'}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                  {settings.draftsPrivacy.allowComments && '💬 Comments'}
                  {settings.draftsPrivacy.allowLikes && '❤️ Likes'}
                  {settings.draftsPrivacy.allowShares && '🔄 Shares'}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Workshops</span>
                  <span className="text-gray-600">
                    {settings.workshopsPrivacy.visibility === 'public' && 'Public'}
                    {settings.workshopsPrivacy.visibility === 'followers' && 'Followers Only'}
                    {settings.workshopsPrivacy.visibility === 'private' && 'Private'}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                  {settings.workshopsPrivacy.allowComments && '💬 Comments'}
                  {settings.workshopsPrivacy.allowLikes && '❤️ Likes'}
                  {settings.workshopsPrivacy.allowShares && '🔄 Shares'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
} 