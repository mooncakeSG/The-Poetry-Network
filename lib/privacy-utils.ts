import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PrivacySettings } from "@/types/privacy"

export async function canViewProfile(targetUserId: string, viewerId?: string) {
  if (!viewerId) return false

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { privacy: true }
  })

  if (!targetUser) return false

  const privacySettings = JSON.parse(targetUser.privacy || '{}') as PrivacySettings

  // User can always view their own profile
  if (viewerId === targetUserId) return true

  switch (privacySettings.profileVisibility) {
    case 'public':
      return true
    case 'followers':
      // Check if viewer is following target user
      const follow = await prisma.follow.findFirst({
        where: {
          followerId: viewerId,
          followingId: targetUserId
        }
      })
      return !!follow
    case 'private':
      return false
    default:
      return false
  }
}

export async function canInteractWithContent(
  targetUserId: string,
  viewerId: string,
  contentType: 'poems' | 'drafts' | 'workshops',
  action: 'comment' | 'like' | 'share'
) {
  if (!viewerId) return false

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { privacy: true }
  })

  if (!targetUser) return false

  const privacySettings = JSON.parse(targetUser.privacy || '{}') as PrivacySettings
  const contentPrivacy = privacySettings[`${contentType}Privacy`]

  // User can always interact with their own content
  if (viewerId === targetUserId) return true

  // Check content visibility
  switch (contentPrivacy.visibility) {
    case 'public':
      break
    case 'followers':
      const follow = await prisma.follow.findFirst({
        where: {
          followerId: viewerId,
          followingId: targetUserId
        }
      })
      if (!follow) return false
      break
    case 'private':
      return false
    default:
      return false
  }

  // Check specific interaction permissions
  switch (action) {
    case 'comment':
      return contentPrivacy.allowComments
    case 'like':
      return contentPrivacy.allowLikes
    case 'share':
      return contentPrivacy.allowShares
    default:
      return false
  }
}

export function filterPrivateProfileInfo(user: any, privacySettings: PrivacySettings) {
  const filteredUser = { ...user }

  if (!privacySettings.showEmail) {
    delete filteredUser.email
  }
  if (!privacySettings.showLocation) {
    delete filteredUser.location
  }
  if (!privacySettings.showWebsite) {
    delete filteredUser.website
  }
  if (!privacySettings.showSocialLinks) {
    delete filteredUser.socialLinks
  }

  return filteredUser
} 