import { Request, Response } from "express";
import { Tag } from "../models/Tag";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

export const getTags = asyncHandler(async (req: Request, res: Response) => {
  const tags = await Tag.find().sort({ name: 1 });
  res.status(200).json({ success: true, data: tags });
});

export const createTag = asyncHandler(async (req: Request, res: Response) => {
  const tag = await Tag.create(req.body);
  res.status(201).json({ success: true, data: tag });
});

export const deleteTag = asyncHandler(async (req: Request, res: Response) => {
  const tag = await Tag.findByIdAndDelete(req.params.id);
  if (!tag) throw new ApiError(404, "Tag not found.");
  res.status(200).json({ success: true, message: "Tag deleted." });
});
