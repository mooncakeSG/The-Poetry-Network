import { render, screen, act } from '@testing-library/react';
import { CollaborationOverlay } from '../CollaborationOverlay';

describe('CollaborationOverlay', () => {
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

  beforeEach(() => {
    // Mock window.getComputedStyle
    window.getComputedStyle = jest.fn().mockReturnValue({
      font: '16px Arial',
      padding: '16px',
      lineHeight: '24px',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
    });
  });

  it('should render cursors', () => {
    render(
      <CollaborationOverlay
        editorRef={mockEditorRef}
        cursors={mockCursors}
        selections={[]}
      />
    );

    expect(screen.getByText('User 1')).toBeInTheDocument();
  });

  it('should render selections', () => {
    render(
      <CollaborationOverlay
        editorRef={mockEditorRef}
        cursors={[]}
        selections={mockSelections}
      />
    );

    expect(screen.getByText('User 2')).toBeInTheDocument();
  });

  it('should update dimensions on window resize', () => {
    const { container } = render(
      <CollaborationOverlay
        editorRef={mockEditorRef}
        cursors={[]}
        selections={[]}
      />
    );

    const overlay = container.firstChild as HTMLElement;
    const initialWidth = overlay.style.width;

    // Simulate window resize
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(overlay.style.width).toBe(initialWidth);
  });

  it('should handle multiple cursors and selections', () => {
    const multipleCursors = [
      ...mockCursors,
      {
        position: 10,
        userId: 'user3',
        userName: 'User 3',
        color: '#45B7D1',
      },
    ];

    const multipleSelections = [
      ...mockSelections,
      {
        start: 10,
        end: 15,
        userId: 'user4',
        userName: 'User 4',
        color: '#96CEB4',
      },
    ];

    render(
      <CollaborationOverlay
        editorRef={mockEditorRef}
        cursors={multipleCursors}
        selections={multipleSelections}
      />
    );

    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 3')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
    expect(screen.getByText('User 4')).toBeInTheDocument();
  });

  it('should handle empty cursors and selections', () => {
    render(
      <CollaborationOverlay
        editorRef={mockEditorRef}
        cursors={[]}
        selections={[]}
      />
    );

    // Should render the overlay container but no cursors or selections
    expect(screen.queryByText('User 1')).not.toBeInTheDocument();
    expect(screen.queryByText('User 2')).not.toBeInTheDocument();
  });

  it('should handle null editor ref', () => {
    render(
      <CollaborationOverlay
        editorRef={{ current: null }}
        cursors={mockCursors}
        selections={mockSelections}
      />
    );

    // Should render the overlay container but no cursors or selections
    expect(screen.queryByText('User 1')).not.toBeInTheDocument();
    expect(screen.queryByText('User 2')).not.toBeInTheDocument();
  });

  it('should apply correct styles to cursors and selections', () => {
    render(
      <CollaborationOverlay
        editorRef={mockEditorRef}
        cursors={mockCursors}
        selections={mockSelections}
      />
    );

    const cursor = screen.getByText('User 1').parentElement;
    const selection = screen.getByText('User 2').parentElement;

    expect(cursor).toHaveStyle({
      backgroundColor: '#FF6B6B',
    });

    expect(selection).toHaveStyle({
      backgroundColor: '#4ECDC433',
      border: '1px solid #4ECDC4',
    });
  });
}); 