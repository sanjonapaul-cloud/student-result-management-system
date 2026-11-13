import express from "express";

import {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam
} from "../controllers/examController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Only authenticated admins can manage exams
router.use(protect, authorizeRoles("admin"));

// Exam routes
router.post("/", createExam);
router.get("/", getAllExams);
router.get("/:id", getExamById);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

export default router;