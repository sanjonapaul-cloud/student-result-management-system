
import express from "express";
import {
  getOverallAnalytics,
  getSubjectAnalytics,
  getStudentAnalytics
} from "../controllers/analyticsController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Admin-only analytics
router.get("/overview", authorizeRoles("admin"), getOverallAnalytics);
router.get("/subjects", authorizeRoles("admin"), getSubjectAnalytics);

// Student-only analytics
router.get("/student", authorizeRoles("student"), getStudentAnalytics);

export default router;
