import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { categorySchema } from "../utils/validators";

const router = Router();

router.get("/", getCategories);
router.post("/", protect, validate(categorySchema), createCategory);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

export default router;
