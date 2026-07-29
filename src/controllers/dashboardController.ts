import { Request, Response } from "express";
import { Blog } from "../models/Blog";
import { Comment } from "../models/Comment";
import { Subscriber } from "../models/Subscriber";
import { asyncHandler } from "../utils/asyncHandler";

// GET /api/dashboard/stats (admin)
export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const [totalBlogs, published, drafts, viewsAgg, likesAgg, comments, subscribers] =
    await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ published: true }),
      Blog.countDocuments({ published: false }),
      Blog.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
      Blog.aggregate([{ $group: { _id: null, total: { $sum: "$likes" } } }]),
      Comment.countDocuments(),
      Subscriber.countDocuments(),
    ]);

  res.status(200).json({
    success: true,
    data: {
      totalBlogs,
      published,
      drafts,
      views: viewsAgg[0]?.total || 0,
      likes: likesAgg[0]?.total || 0,
      comments,
      subscribers,
    },
  });
});

// GET /api/dashboard/views-series (admin) — monthly views/likes for the last 7 months
export const getViewsSeries = asyncHandler(async (req: Request, res: Response) => {
  const sevenMonthsAgo = new Date();
  sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 6);
  sevenMonthsAgo.setDate(1);

  const series = await Blog.aggregate([
    { $match: { createdAt: { $gte: sevenMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        views: { $sum: "$views" },
        likes: { $sum: "$likes" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({ success: true, data: series });
});
