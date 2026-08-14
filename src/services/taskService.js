import { getToken } from "../utils/tokenStorage";

const API_URL = `${import.meta.env.VITE_API_URL}/api/tasks`;

const handleResponse = async (response, defaultMessage) => {
  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || defaultMessage);
  }

  return response.json();
};
const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});
export const getTasks = async (
  page = 1,
  limit = 6,
  search = "",
  status = "all",
) => {
  const params = new URLSearchParams({
    page,
    limit,
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

  return handleResponse(response, "Не вдалося завантажити завдання");
};

export const createTask = async (taskData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(taskData),
  });

  return handleResponse(response, "Не вдалося створити завдання");
};

export const updateTask = async (id, taskData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(taskData),
  });

  return handleResponse(response, "Не вдалося оновити завдання");
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return handleResponse(response, "Не вдалося видалити завдання");
};

export const updateTaskStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse(response, "Не вдалося змінити статус");
};
