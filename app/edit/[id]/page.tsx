"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import PostForm from "@/components/post-form"
import type { Post } from "@/lib/types"

export default function EditPost({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch post")
        }
        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError("Error loading post. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            &larr; Back to posts
          </Link>
        </div>
        <div className="flex justify-center py-8">Loading post...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            &larr; Back to posts
          </Link>
        </div>
        <div className="text-red-500 py-8">{error || "Post not found"}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
          &larr; Back to posts
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <PostForm post={post} isEditing={true} />
    </div>
  )
}
