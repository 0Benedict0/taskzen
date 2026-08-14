const notFound = (req, res) => {
  res.status(404).json({
    message: `Маршрут '${req.originalUrl}' не знайдено`,
  });
};

export default notFound;
