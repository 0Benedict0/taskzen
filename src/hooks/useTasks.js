import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../services/taskService";
import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";
import toast from "react-hot-toast";
function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    todo: 0,
    inProgress: 0,
    completed: 0,
  });
  const tasksPerPage = 6;

  const [totalTasks, setTotalTasks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionTaskId, setActionTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const loadTasks = async (page = 1) => {
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
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setError("Не вдалося завантажити завдання.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadTasks(page);
  };
  const completedTasks = stats.completed;
  const inProgressTasks = stats.inProgress;
  const todoTasks = stats.todo;

  useEffect(() => {
    loadTasks(1);
  }, [debouncedSearchQuery, statusFilter]);
  const handleCreateTask = async (newTask) => {
    try {
      setError(null);

      const createdTask = await createTask(newTask);

      setTasks((prevTasks) => [createdTask, ...prevTasks]);

      toast.success("Завдання створено!");
    } catch (error) {
      console.error("Failed to create task:", error);
      setError(error.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setActionTaskId(id);
      setError(null);

      await deleteTask(id);

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));

      toast.success("Завдання видалено");
    } catch (error) {
      console.error("Failed to delete task:", error);
      setError(error.message);
    } finally {
      setActionTaskId(null);
    }
  };
  const handleStatusChange = async (id) => {
    try {
      setActionTaskId(id);
      setError(null);

      const currentTask = tasks.find((task) => task._id === id);

      if (!currentTask) {
        return;
      }

      const nextStatus =
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
    } catch (error) {
      console.error("Failed to change task status:", error);
      setError(error.message);
    } finally {
      setActionTaskId(null);
    }
  };
  const handleDragStatusChange = async (taskId, newStatus) => {
    try {
      setActionTaskId(taskId);
      setError(null);

      const currentTask = tasks.find((task) => task._id === taskId);

      if (!currentTask) return;

      if (currentTask.status === newStatus) return;

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
    } catch (error) {
      console.error("Failed to change task status:", error);
      setError(error.message);
    } finally {
      setActionTaskId(null);
    }
  };
  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (updatedTask) => {
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
    } catch (error) {
      console.error("Failed to update task:", error);
      setError(error.message);
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
