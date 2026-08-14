import { createContext, useEffect, useState } from "react";

import { saveToken, hasToken, removeToken } from "../utils/tokenStorage";

import {
  login as loginRequest,
  getCurrentUser,
  updateProfile as updateProfileRequest,
  changePassword as changePasswordRequest,
  deleteAccount as deleteAccountRequest,
} from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
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

  const login = async (email, password) => {
    const data = await loginRequest({
      email,
      password,
    });

    saveToken(data.token);

    setUser(data.user);
    setIsAuthenticated(true);

    return data;
  };

  const updateProfile = async (userData) => {
    const data = await updateProfileRequest(userData);

    setUser(data.user);

    return data;
  };

  const changePassword = async (passwordData) => {
    return await changePasswordRequest(passwordData);
  };

  const deleteAccount = async () => {
    await deleteAccountRequest();

    removeToken();

    setUser(null);
    setIsAuthenticated(false);
  };

  const logout = () => {
    removeToken();

    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
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
