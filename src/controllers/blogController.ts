import { Request, Response } from "express";
import { Blog } from "../models/Blog";
import { Comment } from "../models/Comment";
import { Like } from "../models/Like";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// GET /api/blogs?category=&tag=&search=&page=&limit=
export const getBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { category, tag, search, page = "1", limit = "9" } = req.query as Record<
    string,
    string
  >;

  const filter: Record<string, any> = { published: true };
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
    ];
  }

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.max(parseInt(limit) || 9, 1);

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .sort({ date: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Blog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: blogs,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// GET /api/blogs/:slug  (increments views)
export const getBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!blog) throw new ApiError(404, "Blog not found.");
  res.status(200).json({ success: true, data: blog });
});

// POST /api/blogs (admin)
export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.create(req.body);
  res.status(201).json({ success: true, data: blog });
});

// PUT /api/blogs/:id (admin)
export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found.");

  Object.assign(blog, req.body);
  await blog.save(); // triggers slug regeneration if title changed

  res.status(200).json({ success: true, data: blog });
});

// DELETE /api/blogs/:id (admin)
export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) throw new ApiError(404, "Blog not found.");

  await Promise.all([
    Comment.deleteMany({ blog: blog._id }),
    Like.deleteMany({ blog: blog._id }),
  ]);

  res.status(200).json({ success: true, message: "Blog deleted." });
});

// GET /api/blogs/admin/all (admin — includes drafts, no pagination filter on published)
export const getAllBlogsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: blogs });
});
