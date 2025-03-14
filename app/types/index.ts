export interface PoemCardData {
  id: string
  title: string
  content: string
  type: string
  createdAt: string
  author: {
    id: string
    name: string | null
    image: string | null
  }
  _count: {
    likes: number
    comments: number
  }
} 