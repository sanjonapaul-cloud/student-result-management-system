import express from "express";

import {
  createResult,
  getAllResults,
  getMyResults,
  getResultById,
  updateResult,
  deleteResult
} from "../controllers/resultController.js";

import {
  protect,
  authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

// All result routes require authentication
router.use(protect);

// Student: view only their own results
router.get(
  "/my-results",
  authorizeRoles("student"),
  getMyResults
);

// Admin: manage results
router.post("/", authorizeRoles("admin"), createResult);
router.get("/", authorizeRoles("admin"), getAllResults);
router.get("/:id", authorizeRoles("admin"), getResultById);
router.put("/:id", authorizeRoles("admin"), updateResult);
router.delete("/:id", authorizeRoles("admin"), deleteResult);

export default router;