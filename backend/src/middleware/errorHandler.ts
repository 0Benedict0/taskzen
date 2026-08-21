import type { Request, Response, NextFunction } from "express";

interface MongooseValidationError extends Error {
  name: "ValidationError";
  errors: Record<string, { message: string }>;
}

interface ErrorWithStatus extends Error {
  statusCode?: number;
}

type AppErrorType = ErrorWithStatus | MongooseValidationError;

const errorHandler = (
  err: AppErrorType,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    const validationError = err as MongooseValidationError;

    res.status(400).json({
      message: "Помилка валідації даних",
      errors: Object.values(validationError.errors).map(
        (error) => error.message,
      ),
    });

    return;
  }

  if (err.name === "CastError") {
    res.status(400).json({
      message: "Некоректний ID",
    });

    return;
  }

  const statusCode =
    "statusCode" in err && typeof err.statusCode === "number"
      ? err.statusCode
      : 500;

  res.status(statusCode).json({
    message: err.message || "Внутрішня помилка сервера",
  });
};

export default errorHandler;
