
import mongoose from "mongoose";
import User from "../models/User.js";
import Result from "../models/Result.js";

// CREATE STUDENT
export const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      rollNumber,
      department,
      semester
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !rollNumber ||
      !department ||
      semester === undefined ||
      semester === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all student details."
      });
    }

    // Validate semester
    const semesterNumber = Number(semester);

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Semester must be a number between 1 and 8."
      });
    }

    // Check password length
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters."
      });
    }

    // Validate and normalize string fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof rollNumber !== "string" ||
      typeof department !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !rollNumber.trim() ||
      !department.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid student details."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedRollNumber = rollNumber.trim().toUpperCase();

    // Check duplicate email or roll number
    const existingStudent = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { rollNumber: normalizedRollNumber }
      ]
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Email or roll number already exists."
      });
    }

    // Create student
    const student = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      rollNumber: normalizedRollNumber,
      department: department.trim(),
      semester: semesterNumber,
      role: "student"
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully.",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        department: student.department,
        semester: student.semester,
        role: student.role
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or roll number already exists."
      });
    }

    console.error("Create student error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while creating student."
    });
  }
};

// GET ALL STUDENTS
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      students
    });

  } catch (error) {
    console.error("Get students error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching students."
    });
  }
};

// GET STUDENT BY ID
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID."
      });
    }

    const student = await User.findOne({
      _id: id,
      role: "student"
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found."
      });
    }

    return res.status(200).json({
      success: true,
      student
    });

  } catch (error) {
    console.error("Get student error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching student."
    });
  }
};

// UPDATE STUDENT
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      rollNumber,
      department,
      semester
    } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID."
      });
    }

    const student = await User.findOne({
      _id: id,
      role: "student"
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found."
      });
    }

    // Check whether any editable field was provided
    const fields = {
      name,
      email,
      rollNumber,
      department,
      semester
    };

    const hasUpdates = Object.values(fields).some(
      (value) => value !== undefined
    );

    if (!hasUpdates) {
      return res.status(400).json({
        success: false,
        message: "No student details provided for update."
      });
    }

    // Validate and update name
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty."
        });
      }

      student.name = name.trim();
    }

    // Validate and update email
    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty."
        });
      }

      student.email = email.trim().toLowerCase();
    }

    // Validate and update roll number
    if (rollNumber !== undefined) {
      if (
        typeof rollNumber !== "string" ||
        !rollNumber.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Roll number cannot be empty."
        });
      }

      student.rollNumber = rollNumber.trim().toUpperCase();
    }

    // Validate and update department
    if (department !== undefined) {
      if (
        typeof department !== "string" ||
        !department.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Department cannot be empty."
        });
      }

      student.department = department.trim();
    }

    // Validate and update semester
    if (semester !== undefined) {
      const semesterNumber = Number(semester);

      if (
        !Number.isInteger(semesterNumber) ||
        semesterNumber < 1 ||
        semesterNumber > 8
      ) {
        return res.status(400).json({
          success: false,
          message: "Semester must be between 1 and 8."
        });
      }

      student.semester = semesterNumber;
    }

    // Check for duplicate email or roll number
    const duplicate = await User.findOne({
      _id: { $ne: student._id },
      $or: [
        { email: student.email },
        { rollNumber: student.rollNumber }
      ]
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Email or roll number already belongs to another user."
      });
    }

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student updated successfully.",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        department: student.department,
        semester: student.semester,
        role: student.role
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or roll number already exists."
      });
    }

    console.error("Update student error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while updating student."
    });
  }
};

// DELETE STUDENT
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate student ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID."
      });
    }

    // Find student without deleting
    const student = await User.findOne({
      _id: id,
      role: "student"
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found."
      });
    }

    // Prevent deletion if student has existing results
    const existingResult = await Result.exists({
      student: id
    });

    if (existingResult) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete a student who has existing results."
      });
    }

    // Delete only after checking associated results
    await User.findOneAndDelete({
      _id: id,
      role: "student"
    });

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully."
    });

  } catch (error) {
    console.error("Delete student error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting student."
    });
  }
};
