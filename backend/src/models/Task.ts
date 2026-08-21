import mongoose, { Document } from "mongoose";

export type TaskStatus = "todo" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type TaskCategory = "frontend" | "backend" | "database" | "other";

export interface ITask extends Document {
  status: TaskStatus;
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>(
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
  },
  {
    timestamps: true,
  },
);

taskSchema.index({ createdAt: -1 });

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
