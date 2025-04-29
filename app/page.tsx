import Link from "next/link"
import BlogList from "@/components/blog-list"
import { Button } from "@/components/ui/button"
import { PenLine } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                My Blog Platform
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Share your thoughts, ideas, and stories with the world
              </p>
            </div>
            <Link href="/create">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <PenLine className="mr-2 h-5 w-5" />
                Create New Post
              </Button>
            </Link>
          </div>

          <div className="h-1 w-full bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20 rounded-full mb-8"></div>
        </header>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
          <BlogList />
        </section>
      </div>
    </main>
  )
}
