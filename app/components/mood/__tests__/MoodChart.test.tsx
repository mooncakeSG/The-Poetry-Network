import { render, screen } from '@testing-library/react';
import { MoodChart } from '../MoodChart';

const mockData = [
  {
    id: '1',
    userId: 'user1',
    mood: 'HAPPY',
    notes: 'Great day!',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    userId: 'user1',
    mood: 'SAD',
    notes: 'Feeling down',
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    userId: 'user1',
    mood: 'ANXIOUS',
    notes: 'Stressed out',
    createdAt: new Date('2024-01-03'),
  },
];

describe('MoodChart', () => {
  it('should render the chart with mood data', () => {
    render(<MoodChart data={mockData} />);
    
    // Check if the chart container is rendered
    expect(screen.getByTestId('mood-chart')).toBeInTheDocument();
    
    // Check if the chart title is rendered
    expect(screen.getByText('Mood History')).toBeInTheDocument();
  });

  it('should handle empty mood data', () => {
    render(<MoodChart data={[]} />);
    
    // Check if the chart container is still rendered
    expect(screen.getByTestId('mood-chart')).toBeInTheDocument();
    
    // Check if empty state message is shown
    expect(screen.getByText('No mood data available')).toBeInTheDocument();
  });

  it('should format dates correctly', () => {
    render(<MoodChart data={mockData} />);
    
    // Check if dates are formatted correctly
    expect(screen.getByText('Jan 1')).toBeInTheDocument();
    expect(screen.getByText('Jan 2')).toBeInTheDocument();
    expect(screen.getByText('Jan 3')).toBeInTheDocument();
  });

  it('should display correct mood values', () => {
    render(<MoodChart data={mockData} />);
    
    // Check if mood values are displayed correctly
    expect(screen.getByText('5')).toBeInTheDocument(); // HAPPY
    expect(screen.getByText('1')).toBeInTheDocument(); // SAD
    expect(screen.getByText('2')).toBeInTheDocument(); // ANXIOUS
  });

  it('should render tooltip with mood details', () => {
    render(<MoodChart data={mockData} />);
    
    // Check if tooltip container is rendered
    expect(screen.getByTestId('mood-tooltip')).toBeInTheDocument();
  });
}); 