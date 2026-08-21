import mongoose from "mongoose";

import Task, {
  ITask,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "../models/Task.js";

interface TaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  category?: TaskCategory;
  user: mongoose.Types.ObjectId;
}

interface FindTasksOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus | "all";
}

type TaskFilter = {
  user: mongoose.Types.ObjectId;
  status?: TaskStatus;
  $or?: Array<{
    title?: {
      $regex: string;
      $options: string;
    };
    description?: {
      $regex: string;
      $options: string;
    };
  }>;
};

export const findAllTasks = async (
  userId: mongoose.Types.ObjectId,
  { page = 1, limit = 6, search = "", status = "all" }: FindTasksOptions = {},
) => {
  const skip = (page - 1) * limit;

  const filter: TaskFilter = {
    user: userId,
  };

  if (search.trim()) {
    const searchValue = search.trim();

    filter.$or = [
      {
        title: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        description: {
          $regex: searchValue,
          $options: "i",
        },
      },
    ];
  }

  if (status !== "all") {
    filter.status = status;
  }

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

export const createNewTask = async (taskData: TaskData) => {
  return Task.create(taskData);
};

export const removeTask = async (
  id: string,
  userId: mongoose.Types.ObjectId,
) => {
  return Task.findOneAndDelete({
    _id: id,
    user: userId,
  });
};

export const editTask = async (
  id: string,
  userId: mongoose.Types.ObjectId,
  taskData: Partial<Omit<ITask, "createdAt" | "updatedAt" | "user">>,
) => {
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

export const updateTaskStatus = async (id: string, status: TaskStatus) => {
  return Task.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    },
  );
};
