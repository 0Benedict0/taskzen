import AppError from "../utils/AppError.js";

const allowedPriorities = ["low", "medium", "high"];
const allowedCategories = ["frontend", "backend", "database", "other"];
const allowedStatuses = ["todo", "in-progress", "completed"];

export const validateTask = (req, res, next) => {
  const { title, priority, category, status } = req.body;

  if (title !== undefined && (!title || !title.trim())) {
    return next(new AppError("Назва завдання обов'язкова", 400));
  }

  if (priority !== undefined && !allowedPriorities.includes(priority)) {
    return next(new AppError("Некоректний пріоритет", 400));
  }

  if (category !== undefined && !allowedCategories.includes(category)) {
    return next(new AppError("Некоректна категорія", 400));
  }

  if (
    req.method === "PATCH" &&
    status !== undefined &&
    !allowedStatuses.includes(status)
  ) {
    return next(new AppError("Некоректний статус", 400));
  }

  next();
};
