import { Navigate } from "react-router-dom";
import { store } from "../app/store";
import { clearAuth } from "../features/auth/auth.slice";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    store.dispatch(clearAuth());
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
