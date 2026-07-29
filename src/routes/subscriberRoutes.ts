import { Router } from "express";
import {
  subscribe,
  getSubscribers,
  deleteSubscriber,
} from "../controllers/subscriberController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { subscriberSchema } from "../utils/validators";

const router = Router();

router.post("/", validate(subscriberSchema), subscribe);
router.get("/", protect, getSubscribers);
router.delete("/:id", protect, deleteSubscriber);

export default router;
