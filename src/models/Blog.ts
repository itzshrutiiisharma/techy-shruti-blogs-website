import { Schema, model, Document } from "mongoose";
import slugify from "slugify";

export interface IBlog extends Document {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  date: Date;
  readTime: number;
  likes: number;
  commentsCount: number;
  views: number;
  gradient: string;
  content: string[];
  published: boolean;
}

const blogSchema = new Schema<IBlog>(
  {
    slug: { type: String, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    author: { type: String, required: true },
    authorRole: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    readTime: { type: Number, default: 5 },
    likes: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    gradient: { type: String, default: "from-cyan-400 to-blue-500" },
    content: { type: [String], required: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// auto-generate a unique slug from the title
blogSchema.pre("validate", async function (next) {
  if (!this.isModified("title") && this.slug) return next();

  const base = slugify(this.title, { lower: true, strict: true });
  let candidate = base;
  let counter = 1;

  while (
    await (this.constructor as any).findOne({
      slug: candidate,
      _id: { $ne: this._id },
    })
  ) {
    candidate = `${base}-${counter++}`;
  }

  this.slug = candidate;
  next();
});

export const Blog = model<IBlog>("Blog", blogSchema);
