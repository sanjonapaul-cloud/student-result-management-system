
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/healthRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// API routes
app.use("/api", healthRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
