import { useState } from 'react';
import { useAI } from '@/lib/hooks/useAI';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function SentimentAnalyzer() {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const { analyzeSentiment, loading, error } = useAI();

  const handleSubmit = async () => {
    try {
      const result = await analyzeSentiment(content);
      setAnalysis(result);
    } catch (err) {
      console.error('Failed to analyze sentiment:', err);
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Sentiment Analysis</h2>
        <p className="text-muted-foreground">
          Analyze the emotional tone and themes of your writing.
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder="Enter your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px]"
        />

        <Button 
          onClick={handleSubmit} 
          disabled={loading || !content.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Sentiment'
          )}
        </Button>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        {analysis && (
          <Card className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Overall Sentiment</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-medium ${getSentimentColor(analysis.overallSentiment.label)}`}>
                  {analysis.overallSentiment.label.charAt(0).toUpperCase() + analysis.overallSentiment.label.slice(1)}
                </span>
                <span className="text-muted-foreground">
                  ({(analysis.overallSentiment.score * 100).toFixed(1)}% confidence)
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Emotions Detected</h3>
              <div className="grid grid-cols-2 gap-2">
                {analysis.emotions.map((emotion: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{emotion.name}</span>
                    <span className="text-muted-foreground">
                      {(emotion.score * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Main Topics</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.topics.map((topic: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 