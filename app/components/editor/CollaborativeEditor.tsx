'use client';

import { useEffect, useRef, useState } from 'react';
import { useCollaboration } from '@/app/hooks/useCollaboration';
import { CollaborationOverlay } from './CollaborationOverlay';
import { useEditorErrors } from '@/app/hooks/useEditorErrors';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';

interface CollaborativeEditorProps {
  poemId: string;
  initialContent: string;
  onSave: (content: string) => Promise<void>;
}

// Generate a random color for a user
const generateUserColor = (userId: string) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#1ABC9C',
  ];
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

function EditorContent({ poemId, initialContent, onSave }: CollaborativeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [remoteCursors, setRemoteCursors] = useState<Array<{
    position: number;
    userId: string;
    userName: string;
    color: string;
  }>>([]);
  const [remoteSelections, setRemoteSelections] = useState<Array<{
    start: number;
    end: number;
    userId: string;
    userName: string;
    color: string;
  }>>([]);

  const {
    errors,
    validateContent,
    handleNetworkError,
    handleCollaborationError,
    clearErrors,
    getFieldError,
  } = useEditorErrors();

  const { sendEdit, sendCursor, sendSelection } = useCollaboration({
    poemId,
    onEdit: (newContent) => {
      setContent(newContent);
      clearErrors();
    },
    onCursor: (cursor) => {
      setRemoteCursors((prev) => {
        const newCursors = prev.filter((c) => c.userId !== cursor.userId);
        return [
          ...newCursors,
          {
            ...cursor,
            color: generateUserColor(cursor.userId),
          },
        ];
      });
    },
    onSelection: (selection) => {
      setRemoteSelections((prev) => {
        const newSelections = prev.filter((s) => s.userId !== selection.userId);
        return [
          ...newSelections,
          {
            ...selection,
            color: generateUserColor(selection.userId),
          },
        ];
      });
    },
    onError: handleCollaborationError,
  });

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    validateContent(newContent);
    sendEdit(newContent);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (editorRef.current) {
      sendCursor(editorRef.current.selectionStart);
    }
  };

  const handleSelect = () => {
    if (editorRef.current) {
      const { selectionStart, selectionEnd } = editorRef.current;
      if (selectionStart !== selectionEnd) {
        sendSelection(selectionStart, selectionEnd);
      }
    }
  };

  const handleSave = async () => {
    if (!validateContent(content)) {
      return;
    }

    try {
      setIsSaving(true);
      clearErrors();
      await onSave(content);
    } catch (err) {
      handleNetworkError(err instanceof Error ? err : new Error('Failed to save changes'));
    } finally {
      setIsSaving(false);
    }
  };

  const contentError = getFieldError('content');

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          ref={editorRef}
          value={content}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onSelect={handleSelect}
          className={`w-full min-h-[200px] md:h-96 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-base md:text-lg
            touch-manipulation
            resize-none
            overflow-y-auto
            overscroll-contain
            ${contentError ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder="Write your poem here..."
          inputMode="text"
          autoCorrect="on"
          autoCapitalize="sentences"
          spellCheck="true"
        />
        <CollaborationOverlay
          editorRef={editorRef}
          cursors={remoteCursors}
          selections={remoteSelections}
          isMobile={isMobile}
        />
        {contentError && (
          <div className="absolute top-0 right-0 p-2 bg-red-100 text-red-700 rounded-lg text-sm md:text-base">
            {contentError.message}
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSave}
          disabled={isSaving || !!contentError}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
            disabled:opacity-50 disabled:cursor-not-allowed
            text-base md:text-lg
            min-h-[48px]
            touch-manipulation
            active:scale-95
            transition-transform"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

export function CollaborativeEditor(props: CollaborativeEditorProps) {
  return (
    <ErrorBoundary
      onError={(error) => {
        console.error('Editor error:', error);
        // You could send this to an error reporting service
      }}
    >
      <EditorContent {...props} />
    </ErrorBoundary>
  );
} 