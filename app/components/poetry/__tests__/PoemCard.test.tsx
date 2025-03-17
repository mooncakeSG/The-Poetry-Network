import { render, screen } from '@testing-library/react';
import { PoemCard } from '../PoemCard';

const mockPoem = {
  id: '1',
  title: 'Test Poem',
  content: 'This is a test poem content that should be truncated when it gets too long...',
  author: {
    name: 'Test Author',
    image: 'https://example.com/avatar.jpg',
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  published: true,
  publishedAt: new Date('2024-01-01'),
  authorId: 'author1',
  workshopId: null,
};

describe('PoemCard', () => {
  it('should render the poem card with all required information', () => {
    render(<PoemCard poem={mockPoem} />);
    
    // Check if title is rendered
    expect(screen.getByText('Test Poem')).toBeInTheDocument();
    
    // Check if content is rendered (truncated)
    expect(screen.getByText(/This is a test poem content/)).toBeInTheDocument();
    
    // Check if author name is rendered
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    
    // Check if author image is rendered
    const authorImage = screen.getByAltText('Test Author');
    expect(authorImage).toBeInTheDocument();
    expect(authorImage).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('should handle poem without author image', () => {
    const poemWithoutImage = {
      ...mockPoem,
      author: {
        name: 'Test Author',
        image: null,
      },
    };
    
    render(<PoemCard poem={poemWithoutImage} />);
    
    // Check if author name is still rendered
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    
    // Check if default avatar is rendered
    const defaultAvatar = screen.getByAltText('Default avatar');
    expect(defaultAvatar).toBeInTheDocument();
  });

  it('should truncate long content', () => {
    const longPoem = {
      ...mockPoem,
      content: 'This is a very long poem content that should definitely be truncated when it gets too long. We need to make sure that the truncation works correctly and that the ellipsis is added at the right place. This content should be cut off after a certain number of characters.',
    };
    
    render(<PoemCard poem={longPoem} />);
    
    // Check if content is truncated
    expect(screen.getByText(/This is a very long poem content/)).toBeInTheDocument();
    expect(screen.getByText(/.../)).toBeInTheDocument();
  });

  it('should have correct link to poem detail page', () => {
    render(<PoemCard poem={mockPoem} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/poems/${mockPoem.id}`);
  });

  it('should format date correctly', () => {
    render(<PoemCard poem={mockPoem} />);
    
    // Check if date is formatted correctly
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
  });
}); 