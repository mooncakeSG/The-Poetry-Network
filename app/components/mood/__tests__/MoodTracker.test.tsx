import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MoodTracker from '../MoodTracker';
import { createMoodEntry } from '@/actions/mood-actions';

// Mock the server action
jest.mock('@/actions/mood-actions', () => ({
  createMoodEntry: jest.fn(),
}));

describe('MoodTracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render mood options', () => {
    render(<MoodTracker />);
    
    expect(screen.getByText('How are you feeling today?')).toBeInTheDocument();
    expect(screen.getByText('Positive')).toBeInTheDocument();
    expect(screen.getByText('Neutral')).toBeInTheDocument();
    expect(screen.getByText('Struggling')).toBeInTheDocument();
  });

  it('should show notes field when mood is selected', () => {
    render(<MoodTracker />);
    
    fireEvent.click(screen.getByText('Positive'));
    
    expect(screen.getByPlaceholderText('Want to share more about how you\'re feeling?')).toBeInTheDocument();
  });

  it('should submit mood entry successfully', async () => {
    (createMoodEntry as jest.Mock).mockResolvedValueOnce({ success: true });
    
    render(<MoodTracker />);
    
    // Select mood
    fireEvent.click(screen.getByText('Positive'));
    
    // Add notes
    const notesInput = screen.getByPlaceholderText('Want to share more about how you\'re feeling?');
    fireEvent.change(notesInput, {
      target: { value: 'Feeling great today!' }
    });
    
    // Submit
    fireEvent.click(screen.getByText('Save Check-In'));
    
    // Verify submission
    await waitFor(() => {
      expect(createMoodEntry).toHaveBeenCalledWith({
        mood: '😊',
        notes: 'Feeling great today!',
        intensity: 'Positive'
      });
    });
  });

  it('should handle submission error', async () => {
    const error = new Error('Failed to save mood');
    (createMoodEntry as jest.Mock).mockRejectedValueOnce(error);
    
    render(<MoodTracker />);
    
    // Select mood and submit
    fireEvent.click(screen.getByText('Positive'));
    fireEvent.click(screen.getByText('Save Check-In'));
    
    // Verify error handling
    await waitFor(() => {
      expect(createMoodEntry).toHaveBeenCalled();
    });
  });

  it('should clear form after successful submission', async () => {
    (createMoodEntry as jest.Mock).mockResolvedValueOnce({ success: true });
    
    render(<MoodTracker />);
    
    // Select mood and add notes
    fireEvent.click(screen.getByText('Positive'));
    const notesInput = screen.getByPlaceholderText('Want to share more about how you\'re feeling?');
    fireEvent.change(notesInput, {
      target: { value: 'Test notes' }
    });
    
    // Submit
    fireEvent.click(screen.getByText('Save Check-In'));
    
    // Verify form is cleared
    await waitFor(() => {
      expect(notesInput).toHaveValue('');
      expect(screen.getByText('Positive').closest('button')).not.toHaveClass('selected');
    });
  });
}); 