import { createContext, useEffect, useState, type ReactNode } from "react";

import { saveToken, hasToken, removeToken } from "../utils/tokenStorage";

import {
  login as loginRequest,
  getCurrentUser,
  updateProfile as updateProfileRequest,
  changePassword as changePasswordRequest,
  deleteAccount as deleteAccountRequest,
} from "../services/authService";

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ProfileData {
  name: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<unknown>;
  logout: () => void;
  updateProfile: (userData: ProfileData) => Promise<unknown>;
  changePassword: (passwordData: PasswordData) => Promise<unknown>;
  deleteAccount: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      if (!hasToken()) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();

        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error(error);

        removeToken();

        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginRequest({
      email,
      password,
    });

    saveToken(data.token);

    setUser(data.user);
    setIsAuthenticated(true);

    return data;
  };

  const updateProfile = async (userData: ProfileData) => {
    const data = await updateProfileRequest(userData);

    setUser(data.user);

    return data;
  };

  const changePassword = async (passwordData: PasswordData) => {
    return changePasswordRequest(passwordData);
  };

  const deleteAccount = async (): Promise<void> => {
    await deleteAccountRequest();

    removeToken();

    setUser(null);
    setIsAuthenticated(false);
  };

  const logout = (): void => {
    removeToken();

    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
