/**
 * Extracts a human-readable error message from an axios error.
 * Handles both PascalCase (ASP.NET error middleware) and camelCase (controller) responses.
 */
export const extractError = (error: any, fallback = "Something went wrong"): string =>
  error?.response?.data?.Message ||
  error?.response?.data?.message ||
  error?.message ||
  fallback;
