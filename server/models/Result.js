import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"]
    },

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Exam is required"]
    },

    marksObtained: {
      type: Number,
      required: [true, "Marks obtained are required"],
      min: 0
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    grade: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Pass", "Fail"],
      required: true
    }
  },
  { timestamps: true }
);

// One student can have only one result per exam
resultSchema.index(
  { student: 1, exam: 1 },
  { unique: true }
);

const Result = mongoose.model("Result", resultSchema);

export default Result;