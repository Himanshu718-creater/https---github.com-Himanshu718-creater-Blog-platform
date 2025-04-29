import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Post from "@/lib/models/Post"
import { generateSlug } from "@/lib/utils"

export async function GET() {
  try {
    await connectDB()
    const posts = await Post.find({}).sort({ createdAt: -1 })
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ message: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    // Check if slug already exists
    if (body.slug) {
      const existingPost = await Post.findOne({ slug: body.slug })
      if (existingPost) {
        // Append a random string to make the slug unique
        body.slug = `${body.slug}-${Math.random().toString(36).substring(2, 7)}`
      }
    }

    const post = await Post.create({
      title: body.title,
      content: body.content,
      author: body.author,
      slug: body.slug,
      excerpt: body.excerpt,
      tags: body.tags || [],
      featuredImage: body.featuredImage,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to create post",
      },
      { status: 500 },
    )
  }
}
