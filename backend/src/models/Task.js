import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    category: {
      type: String,
      enum: ["frontend", "backend", "database", "other"],
      default: "other",
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },
  },
  {
    timestamps: true,
  },
);
taskSchema.index({ createdAt: -1 });
const Task = mongoose.model("Task", taskSchema);

export default Task;
