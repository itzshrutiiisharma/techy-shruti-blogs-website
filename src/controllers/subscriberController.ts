import { Request, Response } from "express";
import { Subscriber } from "../models/Subscriber";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// POST /api/newsletter (public)
export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const exists = await Subscriber.findOne({ email });
  if (exists) throw new ApiError(409, "This email is already subscribed.");

  const subscriber = await Subscriber.create({ email });
  res.status(201).json({ success: true, data: subscriber });
});

// GET /api/newsletter (admin)
export const getSubscribers = asyncHandler(async (req: Request, res: Response) => {
  const subscribers = await Subscriber.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: subscribers });
});

// DELETE /api/newsletter/:id (admin)
export const deleteSubscriber = asyncHandler(async (req: Request, res: Response) => {
  const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
  if (!subscriber) throw new ApiError(404, "Subscriber not found.");
  res.status(200).json({ success: true, message: "Subscriber removed." });
});
