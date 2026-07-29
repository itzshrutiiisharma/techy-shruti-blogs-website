import { Request, Response } from "express";
import { Comment } from "../models/Comment";
import { Blog } from "../models/Blog";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// POST /api/blogs/:slug/comments (public)
export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) throw new ApiError(404, "Blog not found.");

  const comment = await Comment.create({ ...req.body, blog: blog._id });
  await Blog.findByIdAndUpdate(blog._id, { $inc: { commentsCount: 1 } });

  res.status(201).json({ success: true, data: comment });
});

// GET /api/blogs/:slug/comments (public — approved only)
export const getBlogComments = asyncHandler(async (req: Request, res: Response) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) throw new ApiError(404, "Blog not found.");

  const comments = await Comment.find({ blog: blog._id, status: "Approved" }).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, data: comments });
});

// GET /api/comments (admin — all comments, with blog title populated)
export const getAllComments = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query as Record<string, string>;
  const filter: Record<string, any> = {};
  if (status) filter.status = status;

  const comments = await Comment.find(filter)
    .populate("blog", "title slug")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: comments });
});

// PATCH /api/comments/:id/status (admin)
export const updateCommentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body as { status: "Pending" | "Approved" | "Rejected" };
  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status value.");
  }

  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!comment) throw new ApiError(404, "Comment not found.");

  res.status(200).json({ success: true, data: comment });
});

// DELETE /api/comments/:id (admin)
export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  if (!comment) throw new ApiError(404, "Comment not found.");

  await Blog.findByIdAndUpdate(comment.blog, { $inc: { commentsCount: -1 } });
  res.status(200).json({ success: true, message: "Comment deleted." });
});
