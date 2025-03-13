'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function TestAIPage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testOpenAI = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/test-openai');
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResponse(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testWritingAssistant = async () => {
    if (!input.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'writing-assistant',
          content: input,
        }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">AI Features Test Page</h1>
        <p className="text-muted-foreground">
          Test the OpenAI integration and various AI features.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Test OpenAI Connection</h2>
          <Button 
            onClick={testOpenAI} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Connection'
            )}
          </Button>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Test Writing Assistant</h2>
          <Textarea
            placeholder="Enter some text to analyze..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mb-4 min-h-[100px]"
          />
          <Button 
            onClick={testWritingAssistant} 
            disabled={loading || !input.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Text'
            )}
          </Button>
        </Card>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {response && (
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Response</h2>
          <pre className="whitespace-pre-wrap bg-secondary p-4 rounded-lg">
            {response}
          </pre>
        </Card>
      )}
    </div>
  );
} 