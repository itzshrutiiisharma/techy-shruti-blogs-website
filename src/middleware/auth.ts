import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { Admin } from "../models/Admin";
import { asyncHandler } from "../utils/asyncHandler";

export interface AuthRequest extends Request {
  admin?: { id: string; email: string; name: string };
}

export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const cookieName = process.env.COOKIE_NAME || "techy_token";
    const token =
      req.cookies?.[cookieName] ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : undefined);

    if (!token) {
      throw new ApiError(401, "Not authorized — please log in.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      throw new ApiError(401, "Admin account not found.");
    }

    req.admin = { id: admin.id, email: admin.email, name: admin.name };
    next();
  }
);
