import { useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface CollaborationMessage {
  type: 'join' | 'leave' | 'edit' | 'cursor' | 'selection';
  poemId: string;
  userId: string;
  content?: string;
  cursor?: {
    position: number;
    userId: string;
    userName: string;
  };
  selection?: {
    start: number;
    end: number;
    userId: string;
    userName: string;
  };
}

interface UseCollaborationProps {
  poemId: string;
  onEdit?: (content: string) => void;
  onCursor?: (cursor: { position: number; userId: string; userName: string }) => void;
  onSelection?: (selection: { start: number; end: number; userId: string; userName: string }) => void;
}

export function useCollaboration({
  poemId,
  onEdit,
  onCursor,
  onSelection,
}: UseCollaborationProps) {
  const { data: session } = useSession();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (!session?.user) return;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000'}/api/ws?poemId=${poemId}`
    );

    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(
        JSON.stringify({
          type: 'join',
          poemId,
          userId: session.user.id,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'edit':
            onEdit?.(data.content);
            break;
          case 'cursor':
            onCursor?.(data.cursor);
            break;
          case 'selection':
            onSelection?.(data.selection);
            break;
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current = ws;
  }, [poemId, session?.user?.id, onEdit, onCursor, onSelection]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.send(
          JSON.stringify({
            type: 'leave',
            poemId,
            userId: session?.user?.id || '',
          })
        );
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect, poemId, session?.user?.id]);

  const sendEdit = useCallback(
    (content: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN && session?.user) {
        wsRef.current.send(
          JSON.stringify({
            type: 'edit',
            poemId,
            userId: session.user.id,
            content,
          })
        );
      }
    },
    [poemId, session?.user?.id]
  );

  const sendCursor = useCallback(
    (position: number) => {
      if (wsRef.current?.readyState === WebSocket.OPEN && session?.user) {
        wsRef.current.send(
          JSON.stringify({
            type: 'cursor',
            poemId,
            userId: session.user.id,
            cursor: {
              position,
              userId: session.user.id,
              userName: session.user.name || 'Anonymous',
            },
          })
        );
      }
    },
    [poemId, session?.user?.id, session?.user?.name]
  );

  const sendSelection = useCallback(
    (start: number, end: number) => {
      if (wsRef.current?.readyState === WebSocket.OPEN && session?.user) {
        wsRef.current.send(
          JSON.stringify({
            type: 'selection',
            poemId,
            userId: session.user.id,
            selection: {
              start,
              end,
              userId: session.user.id,
              userName: session.user.name || 'Anonymous',
            },
          })
        );
      }
    },
    [poemId, session?.user?.id, session?.user?.name]
  );

  return {
    sendEdit,
    sendCursor,
    sendSelection,
  };
} 