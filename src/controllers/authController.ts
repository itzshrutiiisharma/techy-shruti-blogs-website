import { Response } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middleware/auth";

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any,
  });

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await admin.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = signToken(admin.id);
  const cookieName = process.env.COOKIE_NAME || "techy_token";

  res.cookie(cookieName, token, cookieOptions());
  res.status(200).json({
    success: true,
    data: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cookieName = process.env.COOKIE_NAME || "techy_token";
  res.clearCookie(cookieName, { ...cookieOptions(), maxAge: 0 });
  res.status(200).json({ success: true, message: "Logged out." });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.status(200).json({ success: true, data: req.admin });
});
