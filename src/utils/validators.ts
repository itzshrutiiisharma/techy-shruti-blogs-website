import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().min(3),
  category: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  author: z.string().min(1),
  authorRole: z.string().optional().default(""),
  readTime: z.number().int().positive().optional().default(5),
  gradient: z.string().optional(),
  content: z.array(z.string()).min(1),
  published: z.boolean().optional().default(true),
});

export const blogUpdateSchema = blogSchema.partial();

export const categorySchema = z.object({
  name: z.string().min(1),
  gradient: z.string().optional(),
});

export const tagSchema = z.object({
  name: z.string().min(1),
});

export const commentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  comment: z.string().min(1).max(2000),
});

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1).max(3000),
});

export const subscriberSchema = z.object({
  email: z.string().email(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const likeSchema = z.object({
  visitorId: z.string().min(1),
});
