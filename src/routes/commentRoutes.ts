import { Router } from "express";
import {
  getAllComments,
  updateCommentStatus,
  deleteComment,
} from "../controllers/commentController";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/", protect, getAllComments);
router.patch("/:id/status", protect, updateCommentStatus);
router.delete("/:id", protect, deleteComment);

export default router;
