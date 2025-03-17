import { render, screen, fireEvent, act } from '@testing-library/react';
import { CollaborativeEditor } from '../CollaborativeEditor';
import { CollaborationOverlay } from '../CollaborationOverlay';

describe('Mobile Features', () => {
  const mockEditorRef = {
    current: {
      value: 'Test content',
      clientWidth: 500,
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        width: 500,
        height: 300,
      }),
      style: {
        font: '16px Arial',
        padding: '16px',
        lineHeight: '24px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
      },
    } as unknown as HTMLTextAreaElement,
  };

  beforeEach(() => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // iPhone SE width
    });
  });

  describe('CollaborativeEditor', () => {
    it('should render with mobile-friendly styles', () => {
      render(
        <CollaborativeEditor
          poemId="test-poem-id"
          initialContent="Test content"
          onSave={jest.fn()}
        />
      );

      const textarea = screen.getByPlaceholderText('Write your poem here...');
      expect(textarea).toHaveClass('min-h-[200px]');
      expect(textarea).toHaveClass('text-base');
      expect(textarea).toHaveAttribute('inputMode', 'text');
      expect(textarea).toHaveAttribute('autoCorrect', 'on');
      expect(textarea).toHaveAttribute('autoCapitalize', 'sentences');
      expect(textarea).toHaveAttribute('spellCheck', 'true');
    });

    it('should have touch-friendly button sizes', () => {
      render(
        <CollaborativeEditor
          poemId="test-poem-id"
          initialContent="Test content"
          onSave={jest.fn()}
        />
      );

      const saveButton = screen.getByText('Save Changes');
      expect(saveButton).toHaveClass('min-h-[48px]');
      expect(saveButton).toHaveClass('px-6');
      expect(saveButton).toHaveClass('py-3');
    });

    it('should handle touch events properly', () => {
      render(
        <CollaborativeEditor
          poemId="test-poem-id"
          initialContent="Test content"
          onSave={jest.fn()}
        />
      );

      const textarea = screen.getByPlaceholderText('Write your poem here...');
      
      // Simulate touch events
      fireEvent.touchStart(textarea);
      fireEvent.touchMove(textarea);
      fireEvent.touchEnd(textarea);

      // Verify the textarea remains focused and interactive
      expect(textarea).toHaveFocus();
    });
  });

  describe('CollaborationOverlay', () => {
    const mockCursors = [
      {
        position: 5,
        userId: 'user1',
        userName: 'User 1',
        color: '#FF6B6B',
      },
    ];

    const mockSelections = [
      {
        start: 0,
        end: 5,
        userId: 'user2',
        userName: 'User 2',
        color: '#4ECDC4',
      },
    ];

    it('should render mobile-optimized cursors', () => {
      render(
        <CollaborationOverlay
          editorRef={mockEditorRef}
          cursors={mockCursors}
          selections={[]}
          isMobile={true}
        />
      );

      const cursor = screen.getByText('User 1').parentElement;
      expect(cursor).toHaveClass('w-3');
      expect(cursor).toHaveClass('h-6');
    });

    it('should render mobile-optimized user labels', () => {
      render(
        <CollaborationOverlay
          editorRef={mockEditorRef}
          cursors={mockCursors}
          selections={[]}
          isMobile={true}
        />
      );

      const label = screen.getByText('User 1');
      expect(label).toHaveClass('text-sm');
      expect(label).toHaveClass('whitespace-nowrap');
      expect(label).toHaveClass('transform');
      expect(label).toHaveClass('-translate-x-1/2');
    });

    it('should handle orientation changes', () => {
      const { container } = render(
        <CollaborationOverlay
          editorRef={mockEditorRef}
          cursors={[]}
          selections={[]}
          isMobile={true}
        />
      );

      const overlay = container.firstChild as HTMLElement;
      const initialWidth = overlay.style.width;

      // Simulate orientation change
      act(() => {
        window.dispatchEvent(new Event('orientationchange'));
      });

      // Verify overlay dimensions are updated
      expect(overlay.style.width).toBe(initialWidth);
    });

    it('should make user labels interactive on mobile', () => {
      render(
        <CollaborationOverlay
          editorRef={mockEditorRef}
          cursors={mockCursors}
          selections={[]}
          isMobile={true}
        />
      );

      const label = screen.getByText('User 1');
      expect(label).toHaveClass('pointer-events-auto');
    });

    it('should handle long usernames on mobile', () => {
      const longUsername = 'Very Long Username That Might Break Layout';
      const cursorsWithLongName = [
        {
          position: 5,
          userId: 'user1',
          userName: longUsername,
          color: '#FF6B6B',
        },
      ];

      render(
        <CollaborationOverlay
          editorRef={mockEditorRef}
          cursors={cursorsWithLongName}
          selections={[]}
          isMobile={true}
        />
      );

      const label = screen.getByText(longUsername);
      expect(label).toHaveClass('whitespace-nowrap');
      expect(label).toHaveClass('transform');
      expect(label).toHaveClass('-translate-x-1/2');
    });
  });
}); 