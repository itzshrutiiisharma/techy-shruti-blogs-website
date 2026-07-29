import { Request, Response } from "express";
import { Like } from "../models/Like";
import { Blog } from "../models/Blog";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// POST /api/blogs/:slug/like  { visitorId }  -> toggles like on/off
export const toggleLike = asyncHandler(async (req: Request, res: Response) => {
  const { visitorId } = req.body;
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) throw new ApiError(404, "Blog not found.");

  const existing = await Like.findOne({ blog: blog._id, visitorId });

  if (existing) {
    await existing.deleteOne();
    blog.likes = Math.max(0, blog.likes - 1);
    await blog.save();
    return res.status(200).json({ success: true, liked: false, likes: blog.likes });
  }

  await Like.create({ blog: blog._id, visitorId });
  blog.likes += 1;
  await blog.save();

  res.status(200).json({ success: true, liked: true, likes: blog.likes });
});

// GET /api/likes (admin — recent likes with blog info)
export const getAllLikes = asyncHandler(async (req: Request, res: Response) => {
  const likes = await Like.find()
    .populate("blog", "title slug")
    .sort({ createdAt: -1 })
    .limit(200);

  res.status(200).json({ success: true, data: likes });
});
