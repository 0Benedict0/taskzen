import {
  findAllTasks,
  createNewTask,
  removeTask,
  editTask,
  updateTaskStatus,
} from "../services/taskService.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
export const getTasks = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const search = req.query.search || "";
    const status = req.query.status || "all";

    const data = await findAllTasks(req.user._id, {
      page,
      limit,
      search,
      status,
    });

    res.status(200).json(data);
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, category } = req.body;

    const task = await createNewTask({
      title,
      description,
      priority,
      category,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

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

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Некоректний ID завдання", 400);
    }

    const updatedTask = await editTask(id, req.user._id, req.body);

    if (!updatedTask) {
      throw new AppError("Завдання не знайдено", 404);
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const changeTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Некоректний ID завдання", 400);
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
