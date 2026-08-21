const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Помилка валідації даних",
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Некоректний ID",
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Внутрішня помилка сервера",
  });
};

export default errorHandler;
