/**
 * Extracts a user-friendly error message from an Axios error or standard error.
 * Prevents exposing internal details or crashing on malformed error responses.
 *
 * @param {Error|Object} error - Caught error object from Axios or application
 * @param {string} [fallbackMessage="An unexpected error occurred. Please try again."] - Fallback message
 * @returns {string} Clean error message
 */
export const getErrorMessage = (
  error,
  fallbackMessage = "An unexpected error occurred. Please try again."
) => {
  if (!error) return fallbackMessage;

  // Axios response error from backend
  if (error.response) {
    const data = error.response.data;

    if (data) {
      // Backend ApiResponse or ApiError standard: { message, errors }
      if (typeof data.message === "string" && data.message.trim().length > 0) {
        return data.message;
      }

      // If array of validation errors
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const firstError = data.errors[0];
        if (typeof firstError === "string") return firstError;
        if (firstError?.msg || firstError?.message) return firstError.msg || firstError.message;
      }

      // If backend returned simple string
      if (typeof data === "string" && data.trim().length > 0) {
        return data;
      }
    }

    // Status code fallback
    switch (error.response.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Session expired or invalid credentials. Please log in.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "Requested resource not found.";
      case 409:
        return "A conflict occurred. Record may already exist.";
      case 422:
        return "Validation failed. Please verify your data.";
      case 500:
        return "Server encountered an error. Please try again later.";
      default:
        return fallbackMessage;
    }
  }

  // Axios network or timeout error (no response received)
  if (error.request) {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return "Request timed out. Please check your connection and try again.";
    }
    return "Unable to reach server. Please check your internet connection.";
  }

  // Regular javascript error
  if (error.message) {
    return error.message;
  }

  return fallbackMessage;
};
