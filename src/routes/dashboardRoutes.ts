import { Router } from "express";
import { getStats, getViewsSeries } from "../controllers/dashboardController";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/stats", protect, getStats);
router.get("/views-series", protect, getViewsSeries);

export default router;
