"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatDate, getReadingTime } from "@/lib/utils"
import type { Post } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Clock, Edit, Trash2, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts")
        if (!response.ok) {
          throw new Error("Failed to fetch posts")
        }
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        setError("Error loading posts. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No posts yet</h2>
        <p className="text-muted-foreground mb-6">Get started by creating your first blog post</p>
        <Link href="/create">
          <Button size="lg">Create Your First Post</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {post.featuredImage ? (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.featuredImage || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-r from-primary/10 to-primary/30 flex items-center justify-center">
                <p className="text-primary/70 font-medium">No featured image</p>
              </div>
            )}

            <CardHeader className="pb-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {post.tags &&
                  post.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
              </div>
              <h2 className="text-xl font-semibold line-clamp-2 hover:text-primary transition-colors">
                <Link href={`/post/${post._id}`}>{post.title}</Link>
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{post.author}</span>
                <span>•</span>
                <Clock className="h-3 w-3" />
                <span>{getReadingTime(post.content)} min read</span>
              </div>
            </CardHeader>

            <CardContent className="pb-4 flex-grow">
              <p className="text-muted-foreground text-sm mb-2">{formatDate(post.createdAt)}</p>
              <p className="line-clamp-3 text-sm">
                {post.excerpt || post.content.replace(/<[^>]*>/g, "").substring(0, 160) + "..."}
              </p>
            </CardContent>

            <CardFooter className="pt-0 border-t flex justify-between">
              <Link href={`/post/${post._id}`} className="w-full">
                <Button variant="ghost" className="w-full justify-start hover:text-primary">
                  Read more
                </Button>
              </Link>
              <div className="flex space-x-1">
                <Link href={`/edit/${post._id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive/90"
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this post?")) {
                      try {
                        const response = await fetch(`/api/posts/${post._id}`, {
                          method: "DELETE",
                        })

                        if (!response.ok) {
                          throw new Error("Failed to delete post")
                        }

                        setPosts(posts.filter((p) => p._id !== post._id))
                      } catch (err) {
                        console.error("Error deleting post:", err)
                        alert("Failed to delete post. Please try again.")
                      }
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
