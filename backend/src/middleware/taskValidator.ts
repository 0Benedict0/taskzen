import type { Request, Response, NextFunction } from "express";

import AppError from "../utils/AppError.js";

const allowedPriorities = ["low", "medium", "high"] as const;
const allowedCategories = ["frontend", "backend", "database", "other"] as const;
const allowedStatuses = ["todo", "in-progress", "completed"] as const;

export const validateTask = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { title, priority, category, status } = req.body;

  if (title !== undefined && (!title || !title.trim())) {
    next(new AppError("Назва завдання обов'язкова", 400));
    return;
  }

  if (priority !== undefined && !allowedPriorities.includes(priority)) {
    next(new AppError("Некоректний пріоритет", 400));
    return;
  }

  if (category !== undefined && !allowedCategories.includes(category)) {
    next(new AppError("Некоректна категорія", 400));
    return;
  }

  if (
    req.method === "PATCH" &&
    status !== undefined &&
    !allowedStatuses.includes(status)
  ) {
    next(new AppError("Некоректний статус", 400));
    return;
  }

  next();
};
