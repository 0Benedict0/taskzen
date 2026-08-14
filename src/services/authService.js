import { getToken } from "../utils/tokenStorage";
const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

const handleResponse = async (response, defaultMessage) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || defaultMessage);
  }

  return data;
};
export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return handleResponse(response, "Не вдалося отримати користувача");
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response, "Не вдалося зареєструватися");
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return handleResponse(response, "Не вдалося увійти");
};

export const changePassword = async (passwordData) => {
  const response = await fetch(`${API_URL}/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(passwordData),
  });

  return handleResponse(response, "Не вдалося змінити пароль");
};

export const deleteAccount = async () => {
  const response = await fetch(`${API_URL}/profile`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return handleResponse(response, "Не вдалося видалити акаунт");
};

export const updateProfile = async (userData) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response, "Не вдалося оновити профіль");
};
