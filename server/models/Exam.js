
import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Exam title is required"],
      trim: true
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject is required"]
    },

    examType: {
      type: String,
      required: [true, "Exam type is required"],
      enum: ["Internal", "Mid Semester", "End Semester", "Practical"]
    },

    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      trim: true
    },

    examDate: {
      type: Date,
      required: [true, "Exam date is required"]
    },

    totalMarks: {
      type: Number,
      required: [true, "Total marks are required"],
      min: 1
    },

    passingMarks: {
      type: Number,
      required: [true, "Passing marks are required"],
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// Ensure passing marks do not exceed total marks
examSchema.pre("validate", function () {
  if (
    this.totalMarks !== undefined &&
    this.passingMarks !== undefined &&
    this.passingMarks > this.totalMarks
  ) {
    this.invalidate(
      "passingMarks",
      "Passing marks cannot exceed total marks."
    );
  }
});

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
