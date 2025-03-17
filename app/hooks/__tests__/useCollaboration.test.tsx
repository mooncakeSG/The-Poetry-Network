import { renderHook, act } from '@testing-library/react';
import { useCollaboration } from '../useCollaboration';
import { useSession } from 'next-auth/react';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('useCollaboration', () => {
  const mockSession = {
    user: {
      id: 'test-user-id',
      name: 'Test User',
    },
  };

  const mockWebSocket = {
    send: jest.fn(),
    close: jest.fn(),
    readyState: WebSocket.OPEN,
    onopen: null as (() => void) | null,
    onmessage: null as ((event: MessageEvent) => void) | null,
    onclose: null as (() => void) | null,
    onerror: null as ((error: Event) => void) | null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({ data: mockSession });
    global.WebSocket = jest.fn().mockImplementation(() => mockWebSocket);
  });

  it('should connect to WebSocket on mount', () => {
    renderHook(() =>
      useCollaboration({
        poemId: 'test-poem-id',
        onEdit: jest.fn(),
        onCursor: jest.fn(),
        onSelection: jest.fn(),
      })
    );

    expect(WebSocket).toHaveBeenCalledWith(
      expect.stringContaining('/api/ws?poemId=test-poem-id')
    );
  });

  it('should send join message on connection', () => {
    renderHook(() =>
      useCollaboration({
        poemId: 'test-poem-id',
        onEdit: jest.fn(),
        onCursor: jest.fn(),
        onSelection: jest.fn(),
      })
    );

    // Simulate WebSocket connection
    act(() => {
      mockWebSocket.onopen?.();
    });

    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: 'join',
        poemId: 'test-poem-id',
        userId: 'test-user-id',
      })
    );
  });

  it('should handle incoming edit messages', () => {
    const onEdit = jest.fn();
    renderHook(() =>
      useCollaboration({
        poemId: 'test-poem-id',
        onEdit,
        onCursor: jest.fn(),
        onSelection: jest.fn(),
      })
    );

    // Simulate WebSocket connection
    act(() => {
      mockWebSocket.onopen?.();
    });

    // Simulate incoming edit message
    act(() => {
      mockWebSocket.onmessage?.({
        data: JSON.stringify({
          type: 'edit',
          content: 'New content',
        }),
      } as MessageEvent);
    });

    expect(onEdit).toHaveBeenCalledWith('New content');
  });

  it('should handle incoming cursor messages', () => {
    const onCursor = jest.fn();
    renderHook(() =>
      useCollaboration({
        poemId: 'test-poem-id',
        onEdit: jest.fn(),
        onCursor,
        onSelection: jest.fn(),
      })
    );

    // Simulate WebSocket connection
    act(() => {
      mockWebSocket.onopen?.();
    });

    // Simulate incoming cursor message
    act(() => {
      mockWebSocket.onmessage?.({
        data: JSON.stringify({
          type: 'cursor',
          cursor: {
            position: 5,
            userId: 'remote-user',
            userName: 'Remote User',
          },
        }),
      } as MessageEvent);
    });

    expect(onCursor).toHaveBeenCalledWith({
      position: 5,
      userId: 'remote-user',
      userName: 'Remote User',
    });
  });

  it('should handle incoming selection messages', () => {
    const onSelection = jest.fn();
    renderHook(() =>
      useCollaboration({
        poemId: 'test-poem-id',
        onEdit: jest.fn(),
        onCursor: jest.fn(),
        onSelection,
      })
    );

    // Simulate WebSocket connection
    act(() => {
      mockWebSocket.onopen?.();
    });

    // Simulate incoming selection message
    act(() => {
      mockWebSocket.onmessage?.({
        data: JSON.stringify({
          type: 'selection',
          selection: {
            start: 0,
            end: 5,
            userId: 'remote-user',
            userName: 'Remote User',
          },
        }),
      } as MessageEvent);
    });

    expect(onSelection).toHaveBeenCalledWith({
      start: 0,
      end: 5,
      userId: 'remote-user',
      userName: 'Remote User',
    });
  });

  it('should send leave message on unmount', () => {
    const { unmount } = renderHook(() =>
      useCollaboration({
        poemId: 'test-poem-id',
        onEdit: jest.fn(),
        onCursor: jest.fn(),
        onSelection: jest.fn(),
      })
    );

    // Simulate WebSocket connection
    act(() => {
      mockWebSocket.onopen?.();
    });

    // Unmount the hook
    unmount();

    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify({
        type: 'leave',
        poemId: 'test-poem-id',
        userId: 'test-user-id',
      })
    );
    expect(mockWebSocket.close).toHaveBeenCalled();
  });

  it('should attempt to reconnect on connection close', () => {
    jest.useFakeTimers();

    renderHook(() =>
      useCollaboration({
        poemId: 'test-poem-id',
        onEdit: jest.fn(),
        onCursor: jest.fn(),
        onSelection: jest.fn(),
      })
    );

    // Simulate WebSocket connection
    act(() => {
      mockWebSocket.onopen?.();
    });

    // Simulate connection close
    act(() => {
      mockWebSocket.onclose?.();
    });

    // Fast forward 3 seconds
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(WebSocket).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it('should not connect if user is not authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });

    renderHook(() =>
      useCollaboration({
        poemId: 'test-poem-id',
        onEdit: jest.fn(),
        onCursor: jest.fn(),
        onSelection: jest.fn(),
      })
    );

    expect(WebSocket).not.toHaveBeenCalled();
  });
}); 