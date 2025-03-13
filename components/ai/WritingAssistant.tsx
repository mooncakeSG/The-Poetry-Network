import { useState } from 'react';
import { useAI } from '@/lib/hooks/useAI';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function WritingAssistant() {
  const [content, setContent] = useState('');
  const [suggestions, setSuggestions] = useState<any>(null);
  const { getWritingSuggestions, loading, error } = useAI();

  const handleSubmit = async () => {
    try {
      const result = await getWritingSuggestions(content);
      setSuggestions(result);
    } catch (err) {
      console.error('Failed to get writing suggestions:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">AI Writing Assistant</h2>
        <p className="text-muted-foreground">
          Get instant feedback and suggestions to improve your writing.
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
            'Get Suggestions'
          )}
        </Button>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        {suggestions && (
          <Card className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Suggestions</h3>
              <ul className="list-disc pl-4 space-y-1">
                {suggestions.suggestions.map((suggestion: string, index: number) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Improvements</h3>
              <ul className="list-disc pl-4 space-y-1">
                {suggestions.improvements.map((improvement: string, index: number) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>

            {suggestions.grammarIssues.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Grammar & Style Issues</h3>
                <ul className="space-y-2">
                  {suggestions.grammarIssues.map((issue: any, index: number) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{issue.text}</span>
                      <p className="text-muted-foreground">
                        Suggestion: {issue.suggestion}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
} 