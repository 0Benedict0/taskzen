import Task from "../models/Task.js";

export const findAllTasks = async (
  userId,
  { page = 1, limit = 6, search = "", status = "all" },
) => {
  const skip = (page - 1) * limit;

  // Фільтр для списку задач
  const filter = {
    user: userId,
  };

  if (search.trim()) {
    filter.$or = [
      {
        title: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        description: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  if (status !== "all") {
    filter.status = status;
  }

  // Окремий фільтр для статистики.
  // Тут НЕ враховуємо search та statusFilter.
  const statsFilter = {
    user: userId,
  };

  const [tasks, totalTasks, stats] = await Promise.all([
    Task.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Task.countDocuments(filter),

    Task.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const statsResult = {
    todo: 0,
    inProgress: 0,
    completed: 0,
  };

  stats.forEach((item) => {
    if (item._id === "todo") {
      statsResult.todo = item.count;
    }

    if (item._id === "in-progress") {
      statsResult.inProgress = item.count;
    }

    if (item._id === "completed") {
      statsResult.completed = item.count;
    }
  });

  return {
    tasks,
    totalTasks,
    currentPage: page,
    totalPages: Math.ceil(totalTasks / limit),

    stats: statsResult,
  };
};

export const createNewTask = async (taskData) => {
  return Task.create(taskData);
};

export const removeTask = async (id, userId) => {
  return Task.findOneAndDelete({
    _id: id,
    user: userId,
  });
};

export const editTask = async (id, userId, taskData) => {
  return Task.findOneAndUpdate(
    {
      _id: id,
      user: userId,
    },
    taskData,
    {
      new: true,
      runValidators: true,
    },
  );
};
export const updateTaskStatus = async (id, status) => {
  return Task.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    },
  );
};
