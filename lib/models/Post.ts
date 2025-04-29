import mongoose from "mongoose"

// Define the Post schema
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for this post"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide content for this post"],
    },
    author: {
      type: String,
      required: [true, "Please provide an author name"],
      maxlength: [50, "Author name cannot be more than 50 characters"],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    excerpt: {
      type: String,
      maxlength: [160, "Excerpt cannot be more than 160 characters"],
    },
    tags: {
      type: [String],
      default: [],
    },
    featuredImage: {
      type: String,
    },
    seoTitle: {
      type: String,
      maxlength: [60, "SEO title cannot be more than 60 characters"],
    },
    seoDescription: {
      type: String,
      maxlength: [160, "SEO description cannot be more than 160 characters"],
    },
  },
  {
    timestamps: true,
  },
)

// Create slug from title if not provided
PostSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }
  next()
})

// Use existing model or create a new one
export default mongoose.models.Post || mongoose.model("Post", PostSchema)
