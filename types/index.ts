export interface Author {
  id: string
  name: string
  image: string | null
}

export interface BasePoemData {
  id: string
  title: string
  content: string
  excerpt?: string
  createdAt: string
  author: Author
  tags?: string[]
  _count?: {
    likes: number
    comments: number
  }
  likes?: number
  comments?: number
  userLiked?: boolean
  featured?: boolean
}

export interface PoemCardData extends BasePoemData {
  excerpt: string
  likes: number
  comments: number
}

export interface PoemDetailData extends BasePoemData {
  content: string
  userLiked: boolean
  _count: {
    likes: number
    comments: number
  }
} 