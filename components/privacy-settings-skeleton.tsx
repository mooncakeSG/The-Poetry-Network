import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PrivacySettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="h-8 w-48 animate-pulse bg-gray-200 rounded" />
        <div className="h-4 w-72 animate-pulse bg-gray-200 rounded mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="h-4 w-32 animate-pulse bg-gray-200 rounded mb-2" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-pulse bg-gray-200 rounded" />
                  <div className="h-4 w-64 animate-pulse bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-4 w-40 animate-pulse bg-gray-200 rounded" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-32 animate-pulse bg-gray-200 rounded" />
                <div className="h-6 w-12 animate-pulse bg-gray-200 rounded" />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="h-4 w-40 animate-pulse bg-gray-200 rounded" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-32 animate-pulse bg-gray-200 rounded" />
                <div className="h-6 w-12 animate-pulse bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="h-10 w-32 animate-pulse bg-gray-200 rounded" />
      </CardContent>
    </Card>
  )
} 