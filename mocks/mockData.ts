export const mockPoems = [
  {
    id: '1',
    title: 'Test Poem',
    content: 'Test Content',
    createdAt: new Date().toISOString(),
    author: {
      id: '1',
      name: 'Test Author',
      image: null,
    },
    _count: {
      likes: 0,
      comments: 0,
    },
    userLiked: false,
  },
] 