import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutApi } from "./auth.api";
import { extractError } from "../../utils/extractError";
import type { RootState } from "../../app/store";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  role: string | null;
  email: string | null;
  fullName: string | null;
  userId: number | null;
  mustChangePassword: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  role: localStorage.getItem("role"),
  email: localStorage.getItem("email"),
  fullName: localStorage.getItem("fullName"),
  userId: localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null,
  mustChangePassword: localStorage.getItem("mustChangePassword") === "true",
  loading: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await loginUser(data);
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Invalid email or password."));
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const refreshToken = state.auth.refreshToken;
    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch {
        // Ignore — still clear local state
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.role = null;
      state.email = null;
      state.fullName = null;
      state.userId = null;
      state.mustChangePassword = false;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("fullName");
      localStorage.removeItem("userId");
      localStorage.removeItem("mustChangePassword");
    },
    setMustChangePassword: (state, action: { payload: boolean }) => {
      state.mustChangePassword = action.payload;
      localStorage.setItem("mustChangePassword", String(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.role = action.payload.role;
        state.email = action.payload.email;
        state.fullName = action.payload.fullName ?? null;
        state.userId = action.payload.userId;
        state.mustChangePassword = action.payload.mustChangePassword;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("role", action.payload.role);
        localStorage.setItem("email", action.payload.email);
        if (action.payload.fullName) localStorage.setItem("fullName", action.payload.fullName);
        localStorage.setItem("userId", action.payload.userId.toString());
        localStorage.setItem("mustChangePassword", String(action.payload.mustChangePassword));
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.refreshToken = null;
        state.role = null;
        state.email = null;
        state.fullName = null;
        state.userId = null;
        state.mustChangePassword = false;
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        localStorage.removeItem("fullName");
        localStorage.removeItem("userId");
        localStorage.removeItem("mustChangePassword");
      });
  },
});

export const { clearAuth, setMustChangePassword } = authSlice.actions;
export default authSlice.reducer;
