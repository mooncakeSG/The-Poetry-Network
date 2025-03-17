import Ably from 'ably/promises';
import { useEffect, useState } from 'react';

// Initialize Ably client
export const ably = new Ably.Realtime.Promise({
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
  clientId: typeof window !== 'undefined' ? 'client-' + Math.random().toString(36).substr(2, 9) : undefined,
});

// Custom hook for using Ably channels
export function useChannel(channelName: string) {
  const [channel] = useState(() => ably.channels.get(channelName));

  useEffect(() => {
    // Subscribe to channel
    channel.subscribe();

    // Cleanup on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [channel]);

  return channel;
}

// Types for collaboration messages
export interface CollaborationMessage {
  type: 'edit' | 'cursor' | 'selection' | 'join' | 'leave';
  userId: string;
  userName: string;
  content?: string;
  position?: number;
  selection?: {
    start: number;
    end: number;
  };
  timestamp: number;
}

// Helper function to create collaboration messages
export function createCollaborationMessage(
  type: CollaborationMessage['type'],
  userId: string,
  userName: string,
  data: Partial<CollaborationMessage> = {}
): CollaborationMessage {
  return {
    type,
    userId,
    userName,
    timestamp: Date.now(),
    ...data,
  };
} 