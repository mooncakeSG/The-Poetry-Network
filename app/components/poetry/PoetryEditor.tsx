'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PoetryEditor() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [poem, setPoem] = useState({
    title: '',
    content: '',
    mood: 'neutral'
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/poems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(poem),
      });

      if (!response.ok) {
        throw new Error('Failed to save poem');
      }

      router.push('/dashboard');
    } catch (error) {
      setError('Failed to save poem. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={poem.title}
            onChange={(e) => setPoem({ ...poem, title: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Poem Content
          </label>
          <textarea
            id="content"
            value={poem.content}
            onChange={(e) => setPoem({ ...poem, content: e.target.value })}
            required
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="mood" className="block text-sm font-medium text-gray-700">
            Mood
          </label>
          <select
            id="mood"
            value={poem.mood}
            onChange={(e) => setPoem({ ...poem, mood: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="happy">Happy</option>
            <option value="neutral">Neutral</option>
            <option value="sad">Sad</option>
            <option value="angry">Angry</option>
            <option value="peaceful">Peaceful</option>
          </select>
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Poem'}
        </button>
      </form>
    </div>
  );
} 