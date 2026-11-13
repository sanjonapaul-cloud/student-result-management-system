import mongoose from "mongoose";
import Subject from "../models/Subject.js";
export const createSubject = async (req, res) => {
  try {
    const {
      name,
      subjectCode,
      department,
      semester,
      credits
    } = req.body;

    // Check required fields
    if (
      !name ||
      !subjectCode ||
      !department ||
      semester === undefined ||
      credits === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All subject fields are required."
      });
    }

    // Normalize values
    const normalizedCode = subjectCode.trim().toUpperCase();
    const normalizedDepartment = department.trim().toUpperCase();

    // Check semester and credits
    const semesterNumber = Number(semester);
    const creditsNumber = Number(credits);

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Semester must be an integer between 1 and 8."
      });
    }

    if (
      !Number.isInteger(creditsNumber) ||
      creditsNumber < 1 ||
      creditsNumber > 10
    ) {
      return res.status(400).json({
        success: false,
        message: "Credits must be an integer between 1 and 10."
      });
    }

    // Check duplicate subject code
    const existingSubject = await Subject.findOne({
      subjectCode: normalizedCode
    });

    if (existingSubject) {
      return res.status(409).json({
        success: false,
        message: "A subject with this code already exists."
      });
    }

    // Create subject
    const subject = await Subject.create({
      name: name.trim(),
      subjectCode: normalizedCode,
      department: normalizedDepartment,
      semester: semesterNumber,
      credits: creditsNumber
    });

    return res.status(201).json({
      success: true,
      message: "Subject created successfully.",
      subject
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Subject code already exists."
      });
    }

    console.error("Create subject error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating subject."
    });
  }
};
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .sort({ semester: 1, subjectCode: 1 });

    return res.status(200).json({
      success: true,
      count: subjects.length,
      subjects
    });

  } catch (error) {
    console.error("Get subjects error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching subjects."
    });
  }
};
export const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID."
      });
    }

    const subject = await Subject.findById(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found."
      });
    }

    return res.status(200).json({
      success: true,
      subject
    });

  } catch (error) {
    console.error("Get subject error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching subject."
    });
  }
};
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      subjectCode,
      department,
      semester,
      credits
    } = req.body;

    // Validate subject ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID."
      });
    }

    const subject = await Subject.findById(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found."
      });
    }

    // Check whether any field was provided
    if (
      name === undefined &&
      subjectCode === undefined &&
      department === undefined &&
      semester === undefined &&
      credits === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update."
      });
    }

    // Validate text fields
    if (
      name !== undefined &&
      (typeof name !== "string" || !name.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject name cannot be empty."
      });
    }

    if (
      subjectCode !== undefined &&
      (typeof subjectCode !== "string" || !subjectCode.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject code cannot be empty."
      });
    }

    if (
      department !== undefined &&
      (typeof department !== "string" || !department.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Department cannot be empty."
      });
    }

    // Update text fields
    if (name !== undefined) subject.name = name.trim();

    if (subjectCode !== undefined) {
      subject.subjectCode = subjectCode.trim().toUpperCase();
    }

    if (department !== undefined) {
      subject.department = department.trim().toUpperCase();
    }

    // Validate semester
    if (semester !== undefined) {
      const semesterNumber = Number(semester);

      if (
        !Number.isInteger(semesterNumber) ||
        semesterNumber < 1 ||
        semesterNumber > 8
      ) {
        return res.status(400).json({
          success: false,
          message: "Semester must be an integer between 1 and 8."
        });
      }

      subject.semester = semesterNumber;
    }

    // Validate credits
    if (credits !== undefined) {
      const creditsNumber = Number(credits);

      if (
        !Number.isInteger(creditsNumber) ||
        creditsNumber < 1 ||
        creditsNumber > 10
      ) {
        return res.status(400).json({
          success: false,
          message: "Credits must be an integer between 1 and 10."
        });
      }

      subject.credits = creditsNumber;
    }

    await subject.save();

    return res.status(200).json({
      success: true,
      message: "Subject updated successfully.",
      subject
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Subject code already exists."
      });
    }

    console.error("Update subject error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating subject."
    });
  }
};
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate subject ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID."
      });
    }

    const subject = await Subject.findByIdAndDelete(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully."
    });

  } catch (error) {
    console.error("Delete subject error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting subject."
    });
  }
};