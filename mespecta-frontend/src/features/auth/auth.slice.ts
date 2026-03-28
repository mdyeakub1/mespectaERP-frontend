import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutApi } from "./auth.api";
import type { RootState } from "../../app/store";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  role: string | null;
  email: string | null;
  fullName: string | null;
  userId: number | null;
  loading: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  role: localStorage.getItem("role"),
  email: localStorage.getItem("email"),
  fullName: localStorage.getItem("fullName"),
  userId: localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null,
  loading: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await loginUser(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.Message ||
        error?.message ||
        "Invalid email or password."
      );
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
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      localStorage.removeItem("fullName");
      localStorage.removeItem("userId");
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

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("role", action.payload.role);
        localStorage.setItem("email", action.payload.email);
        if (action.payload.fullName) localStorage.setItem("fullName", action.payload.fullName);
        localStorage.setItem("userId", action.payload.userId.toString());
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
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        localStorage.removeItem("fullName");
        localStorage.removeItem("userId");
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
