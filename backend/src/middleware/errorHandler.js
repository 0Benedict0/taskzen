const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Помилка валідації даних",
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Некоректний ID",
    });
  }

  // Custom application error
  res.status(err.statusCode || 500).json({
    message: err.message || "Внутрішня помилка сервера",
  });
};

export default errorHandler;
