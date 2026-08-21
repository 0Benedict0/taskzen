import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useDebounce from "./useDebounce";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  type Task,
  type TaskData,
  type TaskStatus,
  type TaskStats,
} from "../services/taskService";

function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [stats, setStats] = useState<TaskStats>({
    todo: 0,
    inProgress: 0,
    completed: 0,
  });

  const tasksPerPage = 6;

  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

  const [actionTaskId, setActionTaskId] = useState<string | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const loadTasks = async (page: number = 1): Promise<void> => {
    console.log("LOAD TASKS START", page);

    try {
      setIsLoading(true);
      setError(null);

      const data = await getTasks(
        page,
        tasksPerPage,
        debouncedSearchQuery,
        statusFilter,
      );

      console.log("TASKS API DATA:", data);

      setTasks(data.tasks);
      setTotalTasks(data.totalTasks);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setStats(data.stats);
    } catch (error: unknown) {
      console.error("Failed to load tasks:", error);

      setError("Не вдалося завантажити завдання.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    loadTasks(page);
  };

  const completedTasks = stats.completed;
  const inProgressTasks = stats.inProgress;
  const todoTasks = stats.todo;

  useEffect(() => {
    loadTasks(1);
  }, [debouncedSearchQuery, statusFilter]);

  const handleCreateTask = async (newTask: TaskData): Promise<void> => {
    try {
      setError(null);

      const createdTask = await createTask(newTask);

      setTasks((prevTasks) => [createdTask, ...prevTasks]);

      toast.success("Завдання створено!");
    } catch (error: unknown) {
      console.error("Failed to create task:", error);

      setError(
        error instanceof Error ? error.message : "Не вдалося створити завдання",
      );
    }
  };

  const handleDeleteTask = async (id: string): Promise<void> => {
    try {
      setActionTaskId(id);
      setError(null);

      await deleteTask(id);

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));

      toast.success("Завдання видалено");
    } catch (error: unknown) {
      console.error("Failed to delete task:", error);

      setError(
        error instanceof Error ? error.message : "Не вдалося видалити завдання",
      );
    } finally {
      setActionTaskId(null);
    }
  };

  const handleStatusChange = async (id: string): Promise<void> => {
    try {
      setActionTaskId(id);
      setError(null);

      const currentTask = tasks.find((task) => task._id === id);

      if (!currentTask) {
        return;
      }

      const nextStatus: TaskStatus =
        currentTask.status === "todo"
          ? "in-progress"
          : currentTask.status === "in-progress"
            ? "completed"
            : "todo";

      await updateTaskStatus(id, nextStatus);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, status: nextStatus } : task,
        ),
      );

      setStats((prev) => ({
        ...prev,

        todo:
          prev.todo +
          (currentTask.status === "todo" ? -1 : 0) +
          (nextStatus === "todo" ? 1 : 0),

        inProgress:
          prev.inProgress +
          (currentTask.status === "in-progress" ? -1 : 0) +
          (nextStatus === "in-progress" ? 1 : 0),

        completed:
          prev.completed +
          (currentTask.status === "completed" ? -1 : 0) +
          (nextStatus === "completed" ? 1 : 0),
      }));

      toast.success("Статус змінено");
    } catch (error: unknown) {
      console.error("Failed to change task status:", error);

      setError(
        error instanceof Error ? error.message : "Не вдалося змінити статус",
      );
    } finally {
      setActionTaskId(null);
    }
  };

  const handleDragStatusChange = async (
    taskId: string,
    newStatus: TaskStatus,
  ): Promise<void> => {
    try {
      setActionTaskId(taskId);
      setError(null);

      const currentTask = tasks.find((task) => task._id === taskId);

      if (!currentTask) {
        return;
      }

      if (currentTask.status === newStatus) {
        return;
      }

      await updateTaskStatus(taskId, newStatus);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task,
        ),
      );

      setStats((prev) => ({
        ...prev,

        todo:
          prev.todo +
          (currentTask.status === "todo" ? -1 : 0) +
          (newStatus === "todo" ? 1 : 0),

        inProgress:
          prev.inProgress +
          (currentTask.status === "in-progress" ? -1 : 0) +
          (newStatus === "in-progress" ? 1 : 0),

        completed:
          prev.completed +
          (currentTask.status === "completed" ? -1 : 0) +
          (newStatus === "completed" ? 1 : 0),
      }));

      toast.success("Статус змінено");

      await loadTasks(currentPage);
    } catch (error: unknown) {
      console.error("Failed to change task status:", error);

      setError(
        error instanceof Error ? error.message : "Не вдалося змінити статус",
      );
    } finally {
      setActionTaskId(null);
    }
  };

  const handleEditTask = (task: Task): void => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (updatedTask: Task): Promise<void> => {
    try {
      setActionTaskId(updatedTask._id);
      setError(null);

      const updatedTaskFromServer = await updateTask(
        updatedTask._id,
        updatedTask,
      );

      toast.success("Завдання оновлено");

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTaskFromServer._id ? updatedTaskFromServer : task,
        ),
      );

      setEditingTask(null);
    } catch (error: unknown) {
      console.error("Failed to update task:", error);

      setError(
        error instanceof Error ? error.message : "Не вдалося оновити завдання",
      );
    } finally {
      setActionTaskId(null);
    }
  };

  const paginatedTasks = tasks;

  return {
    tasks,
    stats,

    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,

    isLoading,
    error,
    actionTaskId,

    handleDragStatusChange,
    loadTasks,
    setError,

    currentPage,
    setCurrentPage,
    totalPages,
    handlePageChange,
    paginatedTasks,

    searchQuery,
    setSearchQuery,

    statusFilter,
    setStatusFilter,

    editingTask,
    setEditingTask,

    taskToDelete,
    setTaskToDelete,

    handleCreateTask,
    handleDeleteTask,
    handleStatusChange,
    handleEditTask,
    handleUpdateTask,
  };
}

export default useTasks;
