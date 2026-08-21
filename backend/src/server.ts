import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;
const HOST = "0.0.0.0";

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "TaskZen API is running",
  });
});

app.use(notFound);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, HOST, () => {
      console.log(`TaskZen API running on ${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
