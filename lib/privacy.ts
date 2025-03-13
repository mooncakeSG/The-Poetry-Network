import { prisma } from '@/lib/prisma'

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'followers'
  allowComments: boolean
  allowLikes: boolean
  allowFollows: boolean
}

const defaultSettings: PrivacySettings = {
  profileVisibility: 'public',
  allowComments: true,
  allowLikes: true,
  allowFollows: true,
}

export async function getUserPrivacySettings(userId: string): Promise<PrivacySettings> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { privacy: true },
  })

  return (user?.privacy as PrivacySettings) || defaultSettings
}

export async function canViewProfile(
  targetUserId: string,
  viewerId?: string
): Promise<boolean> {
  const settings = await getUserPrivacySettings(targetUserId)

  switch (settings.profileVisibility) {
    case 'public':
      return true
    case 'private':
      return false
    case 'followers':
      if (!viewerId) return false
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: viewerId,
            followingId: targetUserId,
          },
        },
      })
      return !!follow
    default:
      return true
  }
}

export async function canInteractWithContent(
  targetUserId: string,
  viewerId?: string,
  action: 'comment' | 'like' | 'follow' = 'comment'
): Promise<boolean> {
  const settings = await getUserPrivacySettings(targetUserId)

  if (!viewerId) return false

  switch (action) {
    case 'comment':
      return settings.allowComments
    case 'like':
      return settings.allowLikes
    case 'follow':
      return settings.allowFollows
    default:
      return false
  }
} 