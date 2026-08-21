import { getToken } from "../utils/tokenStorage";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

interface UserData {
  name: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface UpdateProfileData {
  name: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  message: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

interface CurrentUserResponse {
  message: string;
  user: AuthUser;
}

interface UpdateProfileResponse {
  message: string;
  user: AuthUser;
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

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return handleResponse<CurrentUserResponse>(
    response,
    "Не вдалося отримати користувача",
  );
};

export const register = async (userData: UserData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse<AuthResponse>(response, "Не вдалося зареєструватися");
};

export const login = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return handleResponse<LoginResponse>(response, "Не вдалося увійти");
};

export const changePassword = async (
  passwordData: ChangePasswordData,
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(passwordData),
  });

  return handleResponse<AuthResponse>(response, "Не вдалося змінити пароль");
};

export const deleteAccount = async (): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/profile`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return handleResponse<AuthResponse>(response, "Не вдалося видалити акаунт");
};

export const updateProfile = async (
  userData: UpdateProfileData,
): Promise<UpdateProfileResponse> => {
  const response = await fetch(`${API_URL}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(userData),
  });

  return handleResponse<UpdateProfileResponse>(
    response,
    "Не вдалося оновити профіль",
  );
};
