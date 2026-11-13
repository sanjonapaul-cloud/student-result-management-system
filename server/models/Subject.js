
import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true
    },

    subjectCode: {
      type: String,
      required: [true, "Subject code is required"],
      unique: true,
      trim: true,
      uppercase: true
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      uppercase: true
    },

    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 8
    },

    credits: {
      type: Number,
      required: [true, "Credits are required"],
      min: 1,
      max: 10
    }
  },
  {
    timestamps: true
  }
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
