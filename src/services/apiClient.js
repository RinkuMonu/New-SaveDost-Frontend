import axios from "axios";
import { TOKEN_STORAGE_KEY } from "../utils/constants";

/**
 * Centralized Axios HTTP Client for SaveDost Frontend.
 *
 * Requirements:
 * - Base URL read from process.env.REACT_APP_API_BASE_URL.
 * - Consistent request timeout.
 * - Automatic Bearer token header injection when token is present.
 * - Handles 401 Unauthorized responses without redirect loops.
 * - Never logs credentials, OTPs, or bearer tokens to the console.
 */
const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach Bearer token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore localStorage access failures (e.g. security sandboxes)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized cleanly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthEndpoint =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register") ||
      error.config?.url?.includes("/auth/send-otp") ||
      error.config?.url?.includes("/auth/verify-otp");

    // Clear stored session only for authenticated requests that return 401,
    // not for intentional failed login/registration attempts.
    if (status === 401 && !isAuthEndpoint) {
      try {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } catch {
        // Ignore
      }

      // Dispatch custom event for AuthContext to handle gracefully without full page reload loop
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("savedost:unauthorized"));
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
