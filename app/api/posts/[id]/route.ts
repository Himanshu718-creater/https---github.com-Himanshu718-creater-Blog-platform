import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Post from "@/lib/models/Post"
import { generateSlug } from "@/lib/utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const post = await Post.findById(params.id)

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ message: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content || !body.author) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    // Generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title)
    }

    // Check if slug already exists (but ignore the current post)
    if (body.slug) {
      const existingPost = await Post.findOne({
        slug: body.slug,
        _id: { $ne: params.id },
      })

      if (existingPost) {
        // Append a random string to make the slug unique
        body.slug = `${body.slug}-${Math.random().toString(36).substring(2, 7)}`
      }
    }

    const post = await Post.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        content: body.content,
        author: body.author,
        slug: body.slug,
        excerpt: body.excerpt,
        tags: body.tags || [],
        featuredImage: body.featuredImage,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
      },
      { new: true, runValidators: true },
    )

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to update post",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const post = await Post.findByIdAndDelete(params.id)

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ message: "Failed to delete post" }, { status: 500 })
  }
}
