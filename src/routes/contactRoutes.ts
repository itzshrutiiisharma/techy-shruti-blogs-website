import { Router } from "express";
import {
  sendMessage,
  getMessages,
  markRead,
  deleteMessage,
} from "../controllers/contactController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { contactSchema } from "../utils/validators";

const router = Router();

router.post("/", validate(contactSchema), sendMessage);
router.get("/", protect, getMessages);
router.patch("/:id/read", protect, markRead);
router.delete("/:id", protect, deleteMessage);

export default router;
