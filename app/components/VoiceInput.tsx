'use client';

import { useState, useEffect } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
  useSpeechSynthesis,
} from 'react-speech-recognition';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled = false }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const { speak, speaking } = useSpeechSynthesis();

  // Handle transcript updates
  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  // Handle listening state
  const handleStartListening = () => {
    resetTranscript();
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  // Provide feedback when recording starts/stops
  useEffect(() => {
    if (isListening) {
      speak('Recording started');
    } else {
      speak('Recording stopped');
    }
  }, [isListening, speak]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={disabled || speaking}
          className={`px-4 py-2 rounded-lg font-medium transition-colors
            ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            focus-visible:ring-2 focus-visible:ring-offset-2`}
          aria-label={isListening ? 'Stop recording' : 'Start recording'}
          aria-pressed={isListening}
          aria-busy={speaking}
        >
          {isListening ? '⏹️ Stop Recording' : '🎤 Start Recording'}
        </button>
        {speaking && (
          <span className="text-sm text-gray-500" role="status">
            Speaking...
          </span>
        )}
      </div>
      {transcript && (
        <div
          className="p-4 bg-gray-50 rounded-lg"
          role="region"
          aria-label="Transcript"
        >
          <p className="text-gray-700">{transcript}</p>
        </div>
      )}
    </div>
  );
} 