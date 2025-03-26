import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CollaborativeEditor } from '../CollaborativeEditor';
import { useCollaboration } from '@/app/hooks/useCollaboration';

// Mock the useCollaboration hook
jest.mock('@/app/hooks/useCollaboration', () => ({
  useCollaboration: jest.fn(),
}));

describe('CollaborativeEditor', () => {
  const mockOnSave = jest.fn();
  const mockSendEdit = jest.fn();
  const mockSendCursor = jest.fn();
  const mockSendSelection = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCollaboration as jest.Mock).mockReturnValue({
      sendEdit: mockSendEdit,
      sendCursor: mockSendCursor,
      sendSelection: mockSendSelection,
    });
  });

  it('should render the editor with initial content', () => {
    const initialContent = 'Initial poem content';
    render(
      <CollaborativeEditor
        poemId="test-poem-id"
        initialContent={initialContent}
        onSave={mockOnSave}
      />
    );

    const textarea = screen.getByPlaceholderText('Write your poem here...');
    expect(textarea).toHaveValue(initialContent);
  });

  it('should handle content changes and send updates', () => {
    render(
      <CollaborativeEditor
        poemId="test-poem-id"
        initialContent="Initial content"
        onSave={mockOnSave}
      />
    );

    const textarea = screen.getByPlaceholderText('Write your poem here...');
    fireEvent.change(textarea, { target: { value: 'Updated content' } });

    expect(textarea).toHaveValue('Updated content');
    expect(mockSendEdit).toHaveBeenCalledWith('Updated content');
  });

  it('should handle cursor position updates', () => {
    render(
      <CollaborativeEditor
        poemId="test-poem-id"
        initialContent="Test content"
        onSave={mockOnSave}
      />
    );

    const textarea = screen.getByPlaceholderText('Write your poem here...');
    fireEvent.keyUp(textarea);

    expect(mockSendCursor).toHaveBeenCalled();
  });

  it('should handle text selection updates', () => {
    render(
      <CollaborativeEditor
        poemId="test-poem-id"
        initialContent="Test content"
        onSave={mockOnSave}
      />
    );

    const textarea = screen.getByPlaceholderText('Write your poem here...');
    fireEvent.select(textarea);

    expect(mockSendSelection).toHaveBeenCalled();
  });

  it('should handle save button click', async () => {
    const initialContent = 'Test content';
    render(
      <CollaborativeEditor
        poemId="test-poem-id"
        initialContent={initialContent}
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveTextContent('Saving...');
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(initialContent);
    });
  });

  it('should handle save errors', async () => {
    const error = new Error('Save failed');
    mockOnSave.mockRejectedValueOnce(error);

    render(
      <CollaborativeEditor
        poemId="test-poem-id"
        initialContent="Test content"
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Save failed')).toBeInTheDocument();
    });
  });

  it('should update content when receiving remote edits', () => {
    const initialContent = 'Initial content';
    render(
      <CollaborativeEditor
        poemId="test-poem-id"
        initialContent={initialContent}
        onSave={mockOnSave}
      />
    );

    // Simulate receiving a remote edit
    const { onEdit } = (useCollaboration as jest.Mock).mock.calls[0][0];
    onEdit('Remote edit content');

    const textarea = screen.getByPlaceholderText('Write your poem here...');
    expect(textarea).toHaveValue('Remote edit content');
  });

  it('should handle remote cursor updates', () => {
    render(
      <CollaborativeEditor
        poemId="test-poem-id"
        initialContent="Test content"
        onSave={mockOnSave}
      />
    );

    // Simulate receiving a remote cursor update
    const { onCursor } = (useCollaboration as jest.Mock).mock.calls[0][0];
    onCursor({
      position: 5,
      userId: 'remote-user',
      userName: 'Remote User',
    });

    // The cursor overlay should be rendered with the remote user's cursor
    expect(screen.getByText('Remote User')).toBeInTheDocument();
  });

  it('should handle remote selection updates', () => {
    render(
      <CollaborativeEditor
        poemId="test-poem-id"
        initialContent="Test content"
        onSave={mockOnSave}
      />
    );

    // Simulate receiving a remote selection update
    const { onSelection } = (useCollaboration as jest.Mock).mock.calls[0][0];
    onSelection({
      start: 0,
      end: 5,
      userId: 'remote-user',
      userName: 'Remote User',
    });

    // The selection overlay should be rendered with the remote user's selection
    expect(screen.getByText('Remote User')).toBeInTheDocument();
  });
}); 