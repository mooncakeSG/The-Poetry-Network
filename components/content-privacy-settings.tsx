import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { ContentPrivacySettings } from "@/types/privacy"

interface ContentPrivacySettingsProps {
  title: string
  description: string
  settings: ContentPrivacySettings
  onChange: (settings: ContentPrivacySettings) => void
}

export function ContentPrivacySettingsForm({
  title,
  description,
  settings,
  onChange,
}: ContentPrivacySettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <RadioGroup
        value={settings.visibility}
        onValueChange={(value) =>
          onChange({ ...settings, visibility: value as 'public' | 'followers' | 'private' })
        }
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="public" id={`${title}-public`} />
          <Label htmlFor={`${title}-public`}>Public - Anyone can view</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="followers" id={`${title}-followers`} />
          <Label htmlFor={`${title}-followers`}>Followers Only</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="private" id={`${title}-private`} />
          <Label htmlFor={`${title}-private`}>Private - Only you can view</Label>
        </div>
      </RadioGroup>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor={`${title}-comments`}>Allow Comments</Label>
            <p className="text-sm text-gray-600">Let others comment on this content</p>
          </div>
          <Switch
            id={`${title}-comments`}
            checked={settings.allowComments}
            onCheckedChange={(checked) =>
              onChange({ ...settings, allowComments: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor={`${title}-likes`}>Allow Likes</Label>
            <p className="text-sm text-gray-600">Let others like this content</p>
          </div>
          <Switch
            id={`${title}-likes`}
            checked={settings.allowLikes}
            onCheckedChange={(checked) =>
              onChange({ ...settings, allowLikes: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor={`${title}-shares`}>Allow Shares</Label>
            <p className="text-sm text-gray-600">Let others share this content</p>
          </div>
          <Switch
            id={`${title}-shares`}
            checked={settings.allowShares}
            onCheckedChange={(checked) =>
              onChange({ ...settings, allowShares: checked })
            }
          />
        </div>
      </div>
    </div>
  )
} 