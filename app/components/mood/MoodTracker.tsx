'use client';

import { useState } from 'react';

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😠', label: 'Angry' },
  { emoji: '😌', label: 'Peaceful' }
];

export default function MoodTracker() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const trackMood = async (mood: string) => {
    setIsLoading(true);
    setError('');
    setSelectedMood(mood);

    try {
      const response = await fetch('/api/moods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood }),
      });

      if (!response.ok) {
        throw new Error('Failed to track mood');
      }
    } catch (error) {
      setError('Failed to track mood. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">How are you feeling?</h2>
      <div className="grid grid-cols-2 gap-4">
        {moods.map(({ emoji, label }) => (
          <button
            key={label}
            onClick={() => trackMood(label)}
            disabled={isLoading}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedMood === label
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="text-4xl mb-2">{emoji}</div>
            <div className="text-sm font-medium text-gray-700">{label}</div>
          </button>
        ))}
      </div>
      {error && (
        <div className="mt-4 text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
} 