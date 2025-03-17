'use client';

import { useState } from 'react';
import { createMoodEntry } from "@/actions/mood-actions";

const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Positive', description: 'Feeling good and optimistic' },
  { emoji: '😐', label: 'Neutral', description: 'Feeling balanced or indifferent' },
  { emoji: '😢', label: 'Struggling', description: 'Feeling sad or anxious' }
] as const;

type MoodOption = typeof MOOD_OPTIONS[number];

interface MoodEntry {
  mood: string;
  notes: string;
  intensity: string;
}

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    const moodEntry: MoodEntry = {
      mood: selectedMood,
      notes: additionalNotes,
      intensity: MOOD_OPTIONS.find(m => m.emoji === selectedMood)?.label || ""
    };
    
    await createMoodEntry(moodEntry);
    
    setSelectedMood(null);
    setAdditionalNotes("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">How are you feeling today?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {MOOD_OPTIONS.map(({ emoji, label, description }) => (
          <button
            key={label}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedMood === emoji 
                ? "border-indigo-500 bg-indigo-50" 
                : "border-gray-200 hover:border-indigo-300"
            }`}
            onClick={() => setSelectedMood(emoji)}
          >
            <span className="text-4xl mb-2 block">{emoji}</span>
            <div className="text-left">
              <h3 className="font-semibold">{label}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="space-y-4">
          <textarea
            placeholder="Want to share more about how you're feeling?"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={4}
          />
          <button 
            onClick={handleSubmit} 
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Check-In
          </button>
        </div>
      )}

      <div className="mt-6 text-center">
        <a 
          href="/mental-health-resources" 
          className="text-indigo-600 hover:text-indigo-800 underline"
        >
          View Mental Health Resources
        </a>
      </div>
    </div>
  );
} 