import mongoose from "mongoose";
import Result from "../models/Result.js";
import User from "../models/User.js";
import Exam from "../models/Exam.js";
import calculateResult from "../utils/calculateResult.js";
export const createResult = async (req, res) => {
  try {
    const { student, exam, marksObtained } = req.body;

    // Check required fields
    if (
      !student ||
      !exam ||
      marksObtained === undefined ||
      marksObtained === null ||
      marksObtained === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Student, exam and marks obtained are required."
      });
    }

    // Validate IDs
    if (
      !mongoose.isValidObjectId(student) ||
      !mongoose.isValidObjectId(exam)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid student or exam ID."
      });
    }

    // Check whether the student exists
    const existingStudent = await User.findOne({
      _id: student,
      role: "student"
    });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found."
      });
    }

    // Check whether the exam exists
    const existingExam = await Exam.findById(exam);

    if (!existingExam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });
    }

    // Validate marks
    const marks = Number(marksObtained);

    if (
      !Number.isFinite(marks) ||
      marks < 0 ||
      marks > existingExam.totalMarks
    ) {
      return res.status(400).json({
        success: false,
        message: `Marks must be between 0 and ${existingExam.totalMarks}.`
      });
    }

    // Calculate percentage, grade and status
    const calculatedResult = calculateResult(
      marks,
      existingExam.totalMarks,
      existingExam.passingMarks
    );

    // Save result
    const result = await Result.create({
      student,
      exam,
      marksObtained: marks,
      ...calculatedResult
    });

    return res.status(201).json({
      success: true,
      message: "Result created successfully.",
      result
    });

  } catch (error) {
    // Handle duplicate student-exam combination
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A result already exists for this student and exam."
      });
    }

    console.error("Create result error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating result."
    });
  }
};
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate(
        "student",
        "name email rollNumber department semester"
      )
      .populate({
        path: "exam",
        select: "title examType academicYear examDate totalMarks passingMarks",
        populate: {
          path: "subject",
          select: "name subjectCode department semester"
        }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: results.length,
      results
    });

  } catch (error) {
    console.error("Get all results error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching results."
    });
  }
};
export const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({
      student: req.user._id
    })
      .populate(
        "student",
        "name email rollNumber department semester"
      )
      .populate({
        path: "exam",
        select: "title examType academicYear examDate totalMarks passingMarks",
        populate: {
          path: "subject",
          select: "name subjectCode department semester"
        }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: results.length,
      results
    });

  } catch (error) {
    console.error("Get my results error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching your results."
    });
  }
};
export const getResultById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate result ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid result ID."
      });
    }

    const result = await Result.findById(id)
      .populate(
        "student",
        "name email rollNumber department semester"
      )
      .populate({
        path: "exam",
        select: "title examType academicYear examDate totalMarks passingMarks",
        populate: {
          path: "subject",
          select: "name subjectCode department semester"
        }
      });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found."
      });
    }

    return res.status(200).json({
      success: true,
      result
    });

  } catch (error) {
    console.error("Get result error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching result."
    });
  }
};
export const updateResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { marksObtained } = req.body;

    // Validate result ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid result ID."
      });
    }

    // Check whether marks were provided
    if (
      marksObtained === undefined ||
      marksObtained === null ||
      marksObtained === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Marks obtained are required."
      });
    }

    // Find existing result
    const result = await Result.findById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found."
      });
    }

    // Find the associated exam
    const exam = await Exam.findById(result.exam);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Associated exam not found."
      });
    }

    // Validate updated marks
    const marks = Number(marksObtained);

    if (
      !Number.isFinite(marks) ||
      marks < 0 ||
      marks > exam.totalMarks
    ) {
      return res.status(400).json({
        success: false,
        message: `Marks must be between 0 and ${exam.totalMarks}.`
      });
    }

    // Recalculate result
    const calculatedResult = calculateResult(
      marks,
      exam.totalMarks,
      exam.passingMarks
    );

    result.marksObtained = marks;
    result.percentage = calculatedResult.percentage;
    result.grade = calculatedResult.grade;
    result.status = calculatedResult.status;

    await result.save();

    return res.status(200).json({
      success: true,
      message: "Result updated successfully.",
      result
    });

  } catch (error) {
    console.error("Update result error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating result."
    });
  }
};
export const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate result ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid result ID."
      });
    }

    const result = await Result.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Result deleted successfully."
    });

  } catch (error) {
    console.error("Delete result error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting result."
    });
  }
};