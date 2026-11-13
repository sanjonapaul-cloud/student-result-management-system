
import express from "express";

import {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} from "../controllers/subjectController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

// All subject routes require admin authentication
router.use(protect, authorizeRoles("admin"));

router.post("/", createSubject);
router.get("/", getAllSubjects);
router.get("/:id", getSubjectById);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

export default router;
