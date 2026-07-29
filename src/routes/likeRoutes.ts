import { Router } from "express";
import { getAllLikes } from "../controllers/likeController";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/", protect, getAllLikes);

export default router;
