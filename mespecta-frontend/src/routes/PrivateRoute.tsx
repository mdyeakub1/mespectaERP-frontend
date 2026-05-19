import { Navigate } from "react-router-dom";
import { store } from "../app/store";
import { clearAuth } from "../features/auth/auth.slice";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token        = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  // Allow access if either token is present.
  // An expired access token is fine — the API interceptor will refresh it
  // automatically on the next request and retry transparently.
  // Only redirect when BOTH are gone (logged out or never authenticated).
  if (!token && !refreshToken) {
    store.dispatch(clearAuth());
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
