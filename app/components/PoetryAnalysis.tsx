import { useState, useEffect } from 'react'
import { getPoetryStats } from '@/lib/poetry-analysis'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PoetryAnalysisProps {
  content: string
}

export function PoetryAnalysis({ content }: PoetryAnalysisProps) {
  const [analysis, setAnalysis] = useState<any>(null)

  useEffect(() => {
    const stats = getPoetryStats(content)
    setAnalysis(stats)
  }, [content])

  if (!analysis) {
    return null
  }

  const { totalLines, syllableCounts, averageSyllables, rhymeScheme, meterPatterns } = analysis

  // Determine the dominant meter
  const meterCounts = meterPatterns.reduce((acc: Record<string, number>, pattern: string) => {
    acc[pattern] = (acc[pattern] || 0) + 1
    return acc
  }, {})

  const dominantMeter = Object.entries(meterCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0]

  // Get meter name
  const getMeterName = (pattern: string) => {
    if (pattern.includes('stressed-unstressed')) return 'Trochaic'
    if (pattern.includes('unstressed-stressed')) return 'Iambic'
    if (pattern.includes('stressed-unstressed-unstressed')) return 'Dactylic'
    if (pattern.includes('unstressed-unstressed-stressed')) return 'Anapestic'
    return 'Mixed'
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Poetry Analysis</CardTitle>
          <CardDescription>
            Metrics and patterns in your poem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-medium">Structure</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lines</span>
                  <Badge variant="secondary">{totalLines}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Average Syllables per Line
                  </span>
                  <Badge variant="secondary">
                    {averageSyllables.toFixed(1)}
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium">Meter</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Dominant Meter
                  </span>
                  <Badge>{getMeterName(dominantMeter)}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="mb-2 text-sm font-medium">Rhyme Scheme</h4>
            <ScrollArea className="h-[100px] rounded-md border p-2">
              <div className="space-y-1">
                {content.split('\n').map((line, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{line || '(empty line)'}</span>
                    <Badge
                      variant="outline"
                      className={`rhyme-${rhymeScheme[i]}`}
                    >
                      {rhymeScheme[i]}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="mt-6">
            <h4 className="mb-2 text-sm font-medium">Syllable Pattern</h4>
            <ScrollArea className="h-[100px] rounded-md border p-2">
              <div className="space-y-1">
                {syllableCounts.map((count, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Line {i + 1}
                    </span>
                    <Badge variant="secondary">{count} syllables</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 