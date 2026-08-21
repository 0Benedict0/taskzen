import { getToken } from "../utils/tokenStorage";

const API_URL = `${import.meta.env.VITE_API_URL}/api/tasks`;

export type TaskStatus = "todo" | "in-progress" | "completed";

export type TaskPriority = "low" | "medium" | "high";

export type TaskCategory = "frontend" | "backend" | "database" | "other";

export interface TaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  category?: TaskCategory;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  category?: TaskCategory;
}

export interface Task {
  _id: string;
  user: string;
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  todo: number;
  inProgress: number;
  completed: number;
}

export interface TasksResponse {
  tasks: Task[];
  totalTasks: number;
  currentPage: number;
  totalPages: number;
  stats: TaskStats;
}

interface TaskResponse {
  message?: string;
  task?: Task;
}

const handleResponse = async <T>(
  response: Response,
  defaultMessage: string,
): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || defaultMessage);
  }

  return data;
};

const authHeaders = (): Record<string, string> => ({
  Authorization: `Bearer ${getToken()}`,
});

export const getTasks = async (
  page = 1,
  limit = 6,
  search = "",
  status: TaskStatus | "all" = "all",
): Promise<TasksResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (status !== "all") {
    params.append("status", status);
  }

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    headers: authHeaders(),
  });

  return handleResponse<TasksResponse>(
    response,
    "Не вдалося завантажити завдання",
  );
};

export const createTask = async (taskData: TaskData): Promise<Task> => {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(taskData),
  });

  const data = await handleResponse<TaskResponse>(
    response,
    "Не вдалося створити завдання",
  );

  if (!data.task) {
    throw new Error("Сервер не повернув створене завдання");
  }

  return data.task;
};

export const updateTask = async (
  id: string,
  taskData: UpdateTaskData,
): Promise<Task> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(taskData),
  });

  const data = await handleResponse<TaskResponse>(
    response,
    "Не вдалося оновити завдання",
  );

  if (!data.task) {
    throw new Error("Сервер не повернув оновлене завдання");
  }

  return data.task;
};

export const deleteTask = async (id: string): Promise<TaskResponse> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return handleResponse<TaskResponse>(response, "Не вдалося видалити завдання");
};

export const updateTaskStatus = async (
  id: string,
  status: TaskStatus,
): Promise<TaskResponse> => {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse<TaskResponse>(response, "Не вдалося змінити статус");
};
