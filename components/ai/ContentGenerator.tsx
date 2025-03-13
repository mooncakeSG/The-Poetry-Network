import { useState } from 'react';
import { useAI } from '@/lib/hooks/useAI';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ContentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<'poem' | 'story'>('poem');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const { generateContent, loading, error } = useAI();

  const handleSubmit = async () => {
    try {
      const result = await generateContent(prompt, type);
      setGeneratedContent(result);
    } catch (err) {
      console.error('Failed to generate content:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">AI Content Generator</h2>
        <p className="text-muted-foreground">
          Generate creative content based on your prompts and preferences.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Content Type</label>
          <Select value={type} onValueChange={(value: 'poem' | 'story') => setType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="poem">Poem</SelectItem>
              <SelectItem value="story">Short Story</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="Enter your prompt or theme..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
        />

        <Button 
          onClick={handleSubmit} 
          disabled={loading || !prompt.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Content'
          )}
        </Button>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        {generatedContent && (
          <Card className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Generated Content</h3>
              <div className="whitespace-pre-wrap">
                {generatedContent.content}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Analysis</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Genre:</span>{' '}
                  {generatedContent.metadata.genre.join(', ')}
                </div>
                <div>
                  <span className="font-medium">Themes:</span>{' '}
                  {generatedContent.metadata.themes.join(', ')}
                </div>
                <div>
                  <span className="font-medium">Sentiment:</span>{' '}
                  {generatedContent.metadata.sentiment.label} (
                  {(generatedContent.metadata.sentiment.score * 100).toFixed(1)}%)
                </div>
                <div>
                  <span className="font-medium">Emotions:</span>{' '}
                  {generatedContent.metadata.sentiment.emotions.join(', ')}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 