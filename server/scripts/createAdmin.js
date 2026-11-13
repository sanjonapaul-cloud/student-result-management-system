
import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    // Check environment variables
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Admin environment variables are missing.");
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error("Admin password must contain at least 12 characters.");
    }

    await connectDB();

    const email = ADMIN_EMAIL.trim().toLowerCase();

    // Prevent duplicate admin creation or accidental promotion
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error(
        "An account with this email already exists. Choose a different admin email."
      );
    }

    // Create admin account
    // Password is hashed by the User model's pre-save hook.
    await User.create({
      name: ADMIN_NAME.trim(),
      email,
      password: ADMIN_PASSWORD,
      role: "admin"
    });

    console.log("Admin account created successfully.");

  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;

  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
