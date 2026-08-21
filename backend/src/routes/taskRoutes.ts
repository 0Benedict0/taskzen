import express from "express";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  changeTaskStatus,
} from "../controllers/taskController.js";

import { validateTask } from "../middleware/taskValidator.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getTasks);

router.post("/", authMiddleware, validateTask, createTask);

router.patch("/:id", authMiddleware, validateTask, updateTask);

router.patch("/:id/status", authMiddleware, validateTask, changeTaskStatus);

router.delete("/:id", authMiddleware, deleteTask);

export default router;
