import { render, screen, fireEvent, act } from '@testing-library/react';
import CheckInReminder from '../CheckInReminder';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock setTimeout
jest.useFakeTimers();

describe('CheckInReminder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should not show reminder if checked in today', () => {
    mockLocalStorage.getItem.mockReturnValue(new Date().toDateString());
    
    render(<CheckInReminder />);
    
    expect(screen.queryByText('How are you feeling today?')).not.toBeInTheDocument();
  });

  it('should show reminder after 5 minutes if not checked in today', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(<CheckInReminder />);
    
    // Initially not shown
    expect(screen.queryByText('How are you feeling today?')).not.toBeInTheDocument();
    
    // Fast forward 5 minutes
    act(() => {
      jest.advanceTimersByTime(300000);
    });
    
    // Should be shown now
    expect(screen.getByText('How are you feeling today?')).toBeInTheDocument();
  });

  it('should close reminder when clicking "Remind Me Later"', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(<CheckInReminder />);
    
    // Show reminder
    act(() => {
      jest.advanceTimersByTime(300000);
    });
    
    // Click "Remind Me Later"
    fireEvent.click(screen.getByText('Remind Me Later'));
    
    // Should be hidden
    expect(screen.queryByText('How are you feeling today?')).not.toBeInTheDocument();
  });

  it('should have correct link to check-in page', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(<CheckInReminder />);
    
    // Show reminder
    act(() => {
      jest.advanceTimersByTime(300000);
    });
    
    const checkInLink = screen.getByText('Do Check-In Now');
    expect(checkInLink).toHaveAttribute('href', '/checkin');
  });

  it('should clean up timer on unmount', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const { unmount } = render(<CheckInReminder />);
    
    // Unmount component
    unmount();
    
    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(300000);
    });
    
    // Should not show reminder after unmount
    expect(screen.queryByText('How are you feeling today?')).not.toBeInTheDocument();
  });
}); 