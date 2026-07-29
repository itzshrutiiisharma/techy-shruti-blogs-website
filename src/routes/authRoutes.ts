import { Router } from "express";
import { login, logout, getMe } from "../controllers/authController";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema } from "../utils/validators";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
