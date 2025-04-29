"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import type { Post } from "@/lib/types"
import RichTextEditor from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { generateSlug } from "@/lib/utils"

interface PostFormProps {
  post?: Post
  isEditing?: boolean
}

export default function PostForm({ post, isEditing = false }: PostFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: post?.title || "",
    author: post?.author || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    slug: post?.slug || "",
    tags: post?.tags?.join(", ") || "",
    featuredImage: post?.featuredImage || "",
    seoTitle: post?.seoTitle || "",
    seoDescription: post?.seoDescription || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(post?.featuredImage || null)
  const [activeTab, setActiveTab] = useState("content")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Generate slug if not provided
      if (!formData.slug && formData.title) {
        formData.slug = generateSlug(formData.title)
      }

      // Generate excerpt if not provided
      if (!formData.excerpt && formData.content) {
        // Strip HTML tags and get first 160 characters
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = formData.content
        const textContent = tempDiv.textContent || tempDiv.innerText
        formData.excerpt = textContent.substring(0, 160) + (textContent.length > 160 ? "..." : "")
      }

      // Use title as SEO title if not provided
      if (!formData.seoTitle && formData.title) {
        formData.seoTitle = formData.title
      }

      // Use excerpt as SEO description if not provided
      if (!formData.seoDescription && formData.excerpt) {
        formData.seoDescription = formData.excerpt
      }

      const url = isEditing ? `/api/posts/${post?._id}` : "/api/posts"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Something went wrong")
      }

      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("Error submitting form:", err)
      setError(err instanceof Error ? err.message : "Failed to save post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const { url } = await response.json()
      setFormData((prev) => ({ ...prev, featuredImage: url }))
      setPreviewImage(url)
    } catch (error) {
      console.error("Error uploading image:", error)
      setError("Failed to upload image. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl font-bold">{isEditing ? "Edit Post" : "Create New Post"}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value })
                    // Auto-generate slug on title change if slug is empty
                    if (!formData.slug) {
                      setFormData((prev) => ({
                        ...prev,
                        slug: generateSlug(e.target.value),
                        seoTitle: e.target.value,
                      }))
                    }
                  }}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full"
                  placeholder="post-url-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full"
                  placeholder="technology, news, tutorial"
                />
                {formData.tags && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.split(",").map(
                      (tag, index) =>
                        tag.trim() && (
                          <Badge key={index} variant="secondary">
                            {tag.trim()}
                          </Badge>
                        ),
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your blog post content here..."
                />
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="featuredImage">Featured Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="featuredImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                  />
                  <Input
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="Or enter image URL"
                    className="w-full"
                  />
                </div>
                {previewImage && (
                  <div className="mt-4 relative">
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Featured image preview"
                      className="max-h-[200px] rounded-md object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setPreviewImage(null)
                        setFormData((prev) => ({ ...prev, featuredImage: "" }))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full"
                  placeholder="Brief summary of your post"
                />
                <p className="text-xs text-muted-foreground">{formData.excerpt.length}/160 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full"
                  placeholder="SEO optimized title"
                />
                <p className="text-xs text-muted-foreground">{formData.seoTitle.length}/60 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Input
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full"
                  placeholder="SEO optimized description"
                />
                <p className="text-xs text-muted-foreground">{formData.seoDescription.length}/160 characters</p>
              </div>

              <div className="mt-6 p-4 border border-border rounded-md bg-muted/50">
                <h3 className="font-medium mb-2">SEO Preview</h3>
                <div className="space-y-1">
                  <p className="text-blue-600 text-lg font-medium truncate">
                    {formData.seoTitle || formData.title || "Post Title"}
                  </p>
                  <p className="text-green-700 text-sm">{`yourblog.com/${formData.slug || "post-url"}`}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {formData.seoDescription || formData.excerpt || "Post description will appear here..."}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : isEditing ? (
              "Update Post"
            ) : (
              "Create Post"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
