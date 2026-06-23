import { Navigate, useLocation } from "react-router-dom";
import { store } from "../app/store";
import { clearAuth } from "../features/auth/auth.slice";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const token        = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const role          = localStorage.getItem("role");
  const mustChangePassword = localStorage.getItem("mustChangePassword") === "true";

  // Allow access if either token is present.
  // An expired access token is fine — the API interceptor will refresh it
  // automatically on the next request and retry transparently.
  // Only redirect when BOTH are gone (logged out or never authenticated).
  if (!token && !refreshToken) {
    store.dispatch(clearAuth());
    return <Navigate to="/login" replace />;
  }

  // This portal is Admin-only — craftsmen use a separate portal.
  if (role?.toLowerCase() !== "admin") {
    store.dispatch(clearAuth());
    return <Navigate to="/login" replace />;
  }

  // Force the password-reset gate until the user sets a new password.
  if (mustChangePassword && location.pathname !== "/set-new-password") {
    return <Navigate to="/set-new-password" replace />;
  }

  return <>{children}</>;
}
