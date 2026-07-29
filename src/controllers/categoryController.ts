import { Request, Response } from "express";
import { Category } from "../models/Category";
import { Blog } from "../models/Blog";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find().sort({ name: 1 });

  const withCounts = await Promise.all(
    categories.map(async (c) => ({
      ...c.toObject(),
      count: await Blog.countDocuments({ category: c.name, published: true }),
    }))
  );

  res.status(200).json({ success: true, data: withCounts });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(404, "Category not found.");
  res.status(200).json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, "Category not found.");
  res.status(200).json({ success: true, message: "Category deleted." });
});
