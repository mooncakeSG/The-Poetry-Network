import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface StoryAnalysisProps {
  content: string
}

interface StoryStats {
  wordCount: number
  charCount: number
  sentenceCount: number
  paragraphCount: number
  readingTime: number
  avgSentenceLength: number
  avgParagraphLength: number
}

function analyzeStory(content: string): StoryStats {
  const words = content.trim().split(/\s+/).filter(word => word.length > 0)
  const chars = content.replace(/\s/g, '').length
  const sentences = content.split(/[.!?]+/).filter(sent => sent.trim().length > 0)
  const paragraphs = content.split(/\n\s*\n/).filter(para => para.trim().length > 0)
  
  // Average reading time (words per minute)
  const WPM = 200
  const readingTime = Math.ceil(words.length / WPM)

  return {
    wordCount: words.length,
    charCount: chars,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    readingTime,
    avgSentenceLength: words.length / (sentences.length || 1),
    avgParagraphLength: words.length / (paragraphs.length || 1)
  }
}

export function StoryAnalysis({ content }: StoryAnalysisProps) {
  const [analysis, setAnalysis] = useState<StoryStats | null>(null)

  useEffect(() => {
    const stats = analyzeStory(content)
    setAnalysis(stats)
  }, [content])

  if (!analysis) {
    return null
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Story Analysis</CardTitle>
          <CardDescription>
            Statistics and insights about your story
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 text-sm font-medium">Structure</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Words</span>
                  <Badge variant="secondary">{analysis.wordCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Characters</span>
                  <Badge variant="secondary">{analysis.charCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Paragraphs</span>
                  <Badge variant="secondary">{analysis.paragraphCount}</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium">Readability</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Reading Time</span>
                  <Badge>{analysis.readingTime} min</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Avg. Sentence Length
                  </span>
                  <Badge variant="secondary">
                    {Math.round(analysis.avgSentenceLength)} words
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Avg. Paragraph Length
                  </span>
                  <Badge variant="secondary">
                    {Math.round(analysis.avgParagraphLength)} words
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 