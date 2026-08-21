import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import {
  findAllTasks,
  createNewTask,
  removeTask,
  editTask,
  updateTaskStatus,
} from "../services/taskService.js";

import type {
  ITask,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "../models/Task.js";

import AppError from "../utils/AppError.js";

interface TaskQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
}

interface CreateTaskBody {
  title: string;
  description?: string;
  priority?: string;
  category?: string;
}

interface UpdateTaskBody {
  title?: string;
  description?: string;
  priority?: string;
  category?: string;
}

interface ChangeTaskStatusBody {
  status: string;
}

const isTaskStatus = (value: string): value is TaskStatus => {
  return ["todo", "in-progress", "completed"].includes(value);
};

const isTaskPriority = (value: string): value is TaskPriority => {
  return ["low", "medium", "high"].includes(value);
};

const isTaskCategory = (value: string): value is TaskCategory => {
  return ["frontend", "backend", "database", "other"].includes(value);
};

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, search, status } = req.query as TaskQuery;

    const currentPage = Number(page) || 1;
    const currentLimit = Number(limit) || 6;
    const currentSearch = search || "";

    let currentStatus: TaskStatus | "all" = "all";

    if (status && status !== "all") {
      if (!isTaskStatus(status)) {
        throw new AppError("Некоректний статус", 400);
      }

      currentStatus = status;
    }

    const data = await findAllTasks(req.user._id, {
      page: currentPage,
      limit: currentLimit,
      search: currentSearch,
      status: currentStatus,
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, description, priority, category } =
      req.body as CreateTaskBody;

    let normalizedPriority: TaskPriority | undefined;

    if (priority !== undefined) {
      if (!isTaskPriority(priority)) {
        throw new AppError("Некоректний пріоритет", 400);
      }

      normalizedPriority = priority;
    }

    let normalizedCategory: TaskCategory | undefined;

    if (category !== undefined) {
      if (!isTaskCategory(category)) {
        throw new AppError("Некоректна категорія", 400);
      }

      normalizedCategory = category;
    }

    const task = await createNewTask({
      title,
      description,
      priority: normalizedPriority,
      category: normalizedCategory,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };

    const task = await removeTask(id, req.user._id);

    if (!task) {
      throw new AppError("Завдання не знайдено", 404);
    }

    res.status(200).json({
      message: "Завдання успішно видалено",
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Некоректний ID завдання", 400);
    }

    const body = req.body as UpdateTaskBody;

    if (body.priority !== undefined && !isTaskPriority(body.priority)) {
      throw new AppError("Некоректний пріоритет", 400);
    }

    if (body.category !== undefined && !isTaskCategory(body.category)) {
      throw new AppError("Некоректна категорія", 400);
    }

    const updatedTask = await editTask(
      id,
      req.user._id,
      body as Partial<Omit<ITask, "createdAt" | "updatedAt" | "user">>,
    );

    if (!updatedTask) {
      throw new AppError("Завдання не знайдено", 404);
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const changeTaskStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body as ChangeTaskStatusBody;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Некоректний ID завдання", 400);
    }

    if (!isTaskStatus(status)) {
      throw new AppError("Некоректний статус", 400);
    }

    const updatedTask = await updateTaskStatus(id, status);

    if (!updatedTask) {
      throw new AppError("Завдання не знайдено", 404);
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};
