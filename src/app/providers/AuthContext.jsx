import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import authService from "../../features/auth/services/authService";
import {
  TOKEN_STORAGE_KEY,
  isValidRole,
} from "../../utils/constants";
import { getErrorMessage } from "../../utils/apiError";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Derived current role
  const role = useMemo(() => {
    if (!user?.role) return null;
    const normalized = user.role.toUpperCase();
    return isValidRole(normalized) ? normalized : null;
  }, [user]);

  const isAuthenticated = useMemo(() => {
    return Boolean(user && token && role);
  }, [user, token, role]);

  /**
   * Restores user profile using the stored token on initial app load.
   */
  const restoreSession = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.getCurrentUser();
      const userData = response.data?.user || response.data || response.user;

      if (userData && userData.role) {
        setUser(userData);
        setToken(storedToken);
      } else {
        throw new Error("Invalid user profile received from server");
      }
    } catch (err) {
      // If profile fetch fails (e.g. expired token), clean up stored token
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
      setToken(null);
      setError(getErrorMessage(err, "Session expired. Please log in again."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize session once on mount
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Handle unauthorized events dispatched by apiClient
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      setError("Session expired. Please log in again.");
    };

    window.addEventListener("savedost:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("savedost:unauthorized", handleUnauthorized);
    };
  }, []);

  /**
   * Log in user with password or OTP.
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      const rawData = response.data || response;
      const loggedInUser = rawData.user || response.user;
      const accessToken =
        rawData.accessToken ||
        rawData.token ||
        response.accessToken ||
        response.token;

      if (!accessToken || !loggedInUser) {
        throw new Error("Incomplete login response received from server.");
      }

      // Enforce strict 3-role validation
      const userRole = loggedInUser.role?.toUpperCase();
      if (!isValidRole(userRole)) {
        throw new Error(`Unauthorized role '${loggedInUser.role}'. Access denied.`);
      }

      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      setToken(accessToken);
      setUser(loggedInUser);

      return {
        success: true,
        user: loggedInUser,
        role: userRole,
        message: response.message || "Login successful",
      };
    } catch (err) {
      const message = getErrorMessage(err, "Failed to log in. Please check credentials.");
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register a new user. Always assigned USER role by backend.
   */
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);
      return {
        success: true,
        data: response.data,
        message: response.message || "Registration successful! Please log in.",
      };
    } catch (err) {
      const message = getErrorMessage(err, "Registration failed. Please try again.");
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh current user profile from server.
   */
  const refreshProfile = useCallback(async () => {
    if (!token) return null;

    try {
      const response = await authService.getCurrentUser();
      const userData = response.data;
      if (userData) {
        setUser(userData);
      }
      return userData;
    } catch (err) {
      const message = getErrorMessage(err, "Failed to refresh profile");
      setError(message);
      return null;
    }
  }, [token]);

  /**
   * Logs out user, invalidates session on server, and clears local state.
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch {
      // Non-blocking cleanup
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
      setToken(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      isAuthenticated,
      isLoading,
      error,
      login,
      register,
      logout,
      refreshProfile,
      clearError: () => setError(null),
    }),
    [user, token, role, isAuthenticated, isLoading, error, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
