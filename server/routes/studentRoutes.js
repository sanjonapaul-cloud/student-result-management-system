
import express from "express";

import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} from "../controllers/studentController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

// All student management routes require admin authentication
router.use(protect, authorizeRoles("admin"));

// Create a student
router.post("/", createStudent);

// Get all students
router.get("/", getAllStudents);

// Get one student
router.get("/:id", getStudentById);

// Update a student
router.put("/:id", updateStudent);

// Delete a student
router.delete("/:id", deleteStudent);

export default router;
