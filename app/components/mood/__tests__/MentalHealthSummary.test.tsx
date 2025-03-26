import { render, screen } from '@testing-library/react';
import { MentalHealthSummary } from '../MentalHealthSummary';

describe('MentalHealthSummary', () => {
  const mockMoods = [
    { mood: '😊', date: new Date('2024-01-01') },
    { mood: '😊', date: new Date('2024-01-02') },
    { mood: '😐', date: new Date('2024-01-03') },
    { mood: '😢', date: new Date('2024-01-04') },
    { mood: '😢', date: new Date('2024-01-05') },
  ];

  it('should render mood statistics correctly', () => {
    render(<MentalHealthSummary moods={mockMoods} />);
    
    expect(screen.getByText('Mental Health Overview')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Positive days
    expect(screen.getByText('1')).toBeInTheDocument(); // Neutral days
    expect(screen.getByText('2')).toBeInTheDocument(); // Struggling days
  });

  it('should show total days tracked', () => {
    render(<MentalHealthSummary moods={mockMoods} />);
    
    expect(screen.getByText('5 days tracked')).toBeInTheDocument();
  });

  it('should show support message when struggling days > 3', () => {
    const strugglingMoods = [
      ...mockMoods,
      { mood: '😢', date: new Date('2024-01-06') },
      { mood: '😢', date: new Date('2024-01-07') },
    ];
    
    render(<MentalHealthSummary moods={strugglingMoods} />);
    
    expect(screen.getByText('Consider reaching out for support →')).toBeInTheDocument();
  });

  it('should show positive message when struggling days <= 3', () => {
    render(<MentalHealthSummary moods={mockMoods} />);
    
    expect(screen.getByText('You\'re doing great!')).toBeInTheDocument();
  });

  it('should handle empty moods array', () => {
    render(<MentalHealthSummary moods={[]} />);
    
    expect(screen.getByText('0 days tracked')).toBeInTheDocument();
    expect(screen.getByText('You\'re doing great!')).toBeInTheDocument();
  });
}); 