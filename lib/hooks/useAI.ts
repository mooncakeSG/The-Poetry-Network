import { useState } from 'react';
import { useSession } from 'next-auth/react';

type AIAction = 
  | 'writing-assistant'
  | 'generate-content'
  | 'analyze-sentiment'
  | 'categorize-content'
  | 'get-recommendations'
  | 'provide-feedback'
  | 'check-plagiarism';

interface AIRequestOptions {
  content?: string;
  type?: 'poem' | 'story';
  prompt?: string;
  userInterests?: string[];
  recentActivity?: string[];
}

export function useAI() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeAIRequest = async <T>(action: AIAction, options: AIRequestOptions): Promise<T> => {
    if (!session) {
      throw new Error('User must be authenticated to use AI features');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...options,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to process AI request');
      }

      const data = await response.json();
      return data as T;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getWritingSuggestions: (content: string) => 
      makeAIRequest('writing-assistant', { content }),
    generateContent: (prompt: string, type: 'poem' | 'story') => 
      makeAIRequest('generate-content', { prompt, type }),
    analyzeSentiment: (content: string) => 
      makeAIRequest('analyze-sentiment', { content }),
    categorizeContent: (content: string) => 
      makeAIRequest('categorize-content', { content }),
    getRecommendations: (userInterests: string[], recentActivity: string[]) => 
      makeAIRequest('get-recommendations', { userInterests, recentActivity }),
    provideFeedback: (content: string) => 
      makeAIRequest('provide-feedback', { content }),
    checkPlagiarism: (content: string) => 
      makeAIRequest('check-plagiarism', { content }),
  };
} 