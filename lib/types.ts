export interface Post {
  _id: string
  title: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
  slug?: string
  excerpt?: string
  tags?: string[]
  featuredImage?: string
  seoTitle?: string
  seoDescription?: string
}
