import { Request, Response } from "express";
import { Contact } from "../models/Contact";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// POST /api/contact (public)
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await Contact.create(req.body);
  res.status(201).json({ success: true, data: message });
});

// GET /api/contact (admin)
export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: messages });
});

// PATCH /api/contact/:id/read (admin)
export const markRead = asyncHandler(async (req: Request, res: Response) => {
  const message = await Contact.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  if (!message) throw new ApiError(404, "Message not found.");
  res.status(200).json({ success: true, data: message });
});

// DELETE /api/contact/:id (admin)
export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await Contact.findByIdAndDelete(req.params.id);
  if (!message) throw new ApiError(404, "Message not found.");
  res.status(200).json({ success: true, message: "Message deleted." });
});
