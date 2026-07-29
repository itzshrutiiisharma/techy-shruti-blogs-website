import { Router } from "express";
import { getTags, createTag, deleteTag } from "../controllers/tagController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { tagSchema } from "../utils/validators";

const router = Router();

router.get("/", getTags);
router.post("/", protect, validate(tagSchema), createTag);
router.delete("/:id", protect, deleteTag);

export default router;
