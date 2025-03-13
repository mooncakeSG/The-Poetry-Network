export interface ContentPrivacySettings {
  visibility: 'public' | 'followers' | 'private'
  allowComments: boolean
  allowLikes: boolean
  allowShares: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'followers' | 'private'
  allowComments: boolean
  allowLikes: boolean
  allowFollows: boolean
  showEmail: boolean
  showLocation: boolean
  showWebsite: boolean
  showSocialLinks: boolean
  poemsPrivacy: ContentPrivacySettings
  draftsPrivacy: ContentPrivacySettings
  workshopsPrivacy: ContentPrivacySettings
}

export const DEFAULT_CONTENT_PRIVACY: ContentPrivacySettings = {
  visibility: 'public',
  allowComments: true,
  allowLikes: true,
  allowShares: true,
}

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  profileVisibility: 'public',
  allowComments: true,
  allowLikes: true,
  allowFollows: true,
  showEmail: false,
  showLocation: true,
  showWebsite: true,
  showSocialLinks: true,
  poemsPrivacy: { ...DEFAULT_CONTENT_PRIVACY },
  draftsPrivacy: { ...DEFAULT_CONTENT_PRIVACY, visibility: 'private' },
  workshopsPrivacy: { ...DEFAULT_CONTENT_PRIVACY },
} 