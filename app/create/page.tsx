import Link from "next/link"
import PostForm from "@/components/post-form"

export default function CreatePost() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
          &larr; Back to posts
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <PostForm />
    </div>
  )
}
