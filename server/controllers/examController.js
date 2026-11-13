import mongoose from "mongoose";
import Exam from "../models/Exam.js";
import Subject from "../models/Subject.js";

export const createExam = async (req, res) => {
  try {
    const {
      title,
      subject,
      examType,
      academicYear,
      examDate,
      totalMarks,
      passingMarks
    } = req.body;

    // Check required fields
    if (
      !title ||
      !subject ||
      !examType ||
      !academicYear ||
      !examDate ||
      totalMarks === undefined ||
      passingMarks === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All exam fields are required."
      });
    }

    // Validate subject ID
    if (!mongoose.isValidObjectId(subject)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID."
      });
    }

    // Check whether subject exists
    const existingSubject = await Subject.findById(subject);

    if (!existingSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found."
      });
    }

    // Validate exam type
    const allowedExamTypes = [
      "Internal",
      "Mid Semester",
      "End Semester",
      "Practical"
    ];

    if (!allowedExamTypes.includes(examType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam type."
      });
    }

    // Validate exam date
    const parsedDate = new Date(examDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam date."
      });
    }

    // Validate marks
    const total = Number(totalMarks);
    const passing = Number(passingMarks);

    if (
      !Number.isFinite(total) ||
      !Number.isFinite(passing) ||
      total <= 0 ||
      passing < 0 ||
      passing > total
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid marks. Passing marks cannot exceed total marks."
      });
    }

    // Create exam
    const exam = await Exam.create({
      title: title.trim(),
      subject,
      examType,
      academicYear: academicYear.trim(),
      examDate: parsedDate,
      totalMarks: total,
      passingMarks: passing
    });

    return res.status(201).json({
      success: true,
      message: "Exam created successfully.",
      exam
    });

  } catch (error) {
    console.error("Create exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating exam."
    });
  }
};
export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("subject", "name subjectCode department semester")
      .sort({ examDate: -1 });

    return res.status(200).json({
      success: true,
      count: exams.length,
      exams
    });

  } catch (error) {
    console.error("Get exams error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching exams."
    });
  }
};
export const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID."
      });
    }

    const exam = await Exam.findById(id)
      .populate("subject", "name subjectCode department semester");

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });
    }

    return res.status(200).json({
      success: true,
      exam
    });

  } catch (error) {
    console.error("Get exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching exam."
    });
  }
};
export const updateExam = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      subject,
      examType,
      academicYear,
      examDate,
      totalMarks,
      passingMarks
    } = req.body;

    // Validate exam ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID."
      });
    }

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });
    }

    // Check whether at least one field was provided
    if (
      title === undefined &&
      subject === undefined &&
      examType === undefined &&
      academicYear === undefined &&
      examDate === undefined &&
      totalMarks === undefined &&
      passingMarks === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update."
      });
    }

    // Validate title
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Exam title cannot be empty."
        });
      }

      exam.title = title.trim();
    }

    // Validate subject
    if (subject !== undefined) {
      if (!mongoose.isValidObjectId(subject)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subject ID."
        });
      }

      const existingSubject = await Subject.findById(subject);

      if (!existingSubject) {
        return res.status(404).json({
          success: false,
          message: "Subject not found."
        });
      }

      exam.subject = subject;
    }

    // Validate exam type
    if (examType !== undefined) {
      const allowedExamTypes = [
        "Internal",
        "Mid Semester",
        "End Semester",
        "Practical"
      ];

      if (!allowedExamTypes.includes(examType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid exam type."
        });
      }

      exam.examType = examType;
    }

    // Validate academic year
    if (academicYear !== undefined) {
      if (
        typeof academicYear !== "string" ||
        !academicYear.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Academic year cannot be empty."
        });
      }

      exam.academicYear = academicYear.trim();
    }

    // Validate exam date
    if (examDate !== undefined) {
      const parsedDate = new Date(examDate);

      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid exam date."
        });
      }

      exam.examDate = parsedDate;
    }

    // Validate total marks
    if (totalMarks !== undefined) {
      const total = Number(totalMarks);

      if (!Number.isFinite(total) || total <= 0) {
        return res.status(400).json({
          success: false,
          message: "Total marks must be greater than zero."
        });
      }

      exam.totalMarks = total;
    }

    // Validate passing marks
    if (passingMarks !== undefined) {
      const passing = Number(passingMarks);

      if (!Number.isFinite(passing) || passing < 0) {
        return res.status(400).json({
          success: false,
          message: "Passing marks cannot be negative."
        });
      }

      exam.passingMarks = passing;
    }

    // Validate final marks configuration
    if (exam.passingMarks > exam.totalMarks) {
      return res.status(400).json({
        success: false,
        message: "Passing marks cannot exceed total marks."
      });
    }

    await exam.save();

    const updatedExam = await Exam.findById(exam._id)
      .populate("subject", "name subjectCode department semester");

    return res.status(200).json({
      success: true,
      message: "Exam updated successfully.",
      exam: updatedExam
    });

  } catch (error) {
    console.error("Update exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating exam."
    });
  }
};
export const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate exam ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID."
      });
    }

    const exam = await Exam.findByIdAndDelete(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exam deleted successfully."
    });

  } catch (error) {
    console.error("Delete exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting exam."
    });
  }
};