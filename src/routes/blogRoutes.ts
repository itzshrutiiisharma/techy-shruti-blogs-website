import { Router } from "express";
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsAdmin,
} from "../controllers/blogController";
import { addComment, getBlogComments } from "../controllers/commentController";
import { toggleLike } from "../controllers/likeController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  blogSchema,
  blogUpdateSchema,
  commentSchema,
  likeSchema,
} from "../utils/validators";

const router = Router();

// public
router.get("/", getBlogs);
router.get("/admin/all", protect, getAllBlogsAdmin); // before /:slug so it isn't swallowed
router.get("/:slug", getBlogBySlug);
router.get("/:slug/comments", getBlogComments);
router.post("/:slug/comments", validate(commentSchema), addComment);
router.post("/:slug/like", validate(likeSchema), toggleLike);

// admin
router.post("/", protect, validate(blogSchema), createBlog);
router.put("/:id", protect, validate(blogUpdateSchema), updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
