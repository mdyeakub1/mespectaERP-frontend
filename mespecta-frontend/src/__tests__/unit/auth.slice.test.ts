import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { clearAuth, login, logout } from "../../features/auth/auth.slice";

// Helper: build a fresh store (avoids localStorage leakage between tests)
function makeStore(preloaded?: object) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: preloaded,
  });
}

describe("auth slice — initial state", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with null values when localStorage is empty", () => {
    const store = makeStore();
    const { auth } = store.getState();
    expect(auth.token).toBeNull();
    expect(auth.refreshToken).toBeNull();
    expect(auth.role).toBeNull();
    expect(auth.email).toBeNull();
    expect(auth.fullName).toBeNull();
    expect(auth.userId).toBeNull();
    expect(auth.loading).toBe(false);
  });
});

describe("auth slice — clearAuth", () => {
  beforeEach(() => localStorage.clear());

  it("resets all auth fields to null", () => {
    const store = makeStore({
      auth: {
        token: "tok",
        refreshToken: "ref",
        role: "Admin",
        email: "a@b.com",
        fullName: "Alice",
        userId: 1,
        loading: false,
      },
    });

    store.dispatch(clearAuth());
    const { auth } = store.getState();

    expect(auth.token).toBeNull();
    expect(auth.refreshToken).toBeNull();
    expect(auth.role).toBeNull();
    expect(auth.email).toBeNull();
    expect(auth.fullName).toBeNull();
    expect(auth.userId).toBeNull();
  });

  it("removes items from localStorage", () => {
    localStorage.setItem("token", "tok");
    localStorage.setItem("role", "Admin");

    const store = makeStore();
    store.dispatch(clearAuth());

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("role")).toBeNull();
  });
});

describe("auth slice — login thunk", () => {
  beforeEach(() => localStorage.clear());

  it("sets loading=true on login.pending", () => {
    const store = makeStore();
    // Dispatch the pending action manually
    store.dispatch({ type: login.pending.type });
    expect(store.getState().auth.loading).toBe(true);
  });

  it("sets loading=false on login.rejected", () => {
    const store = makeStore({ auth: { loading: true, token: null, refreshToken: null, role: null, email: null, fullName: null, userId: null } });
    store.dispatch({ type: login.rejected.type });
    expect(store.getState().auth.loading).toBe(false);
  });

  it("populates auth state on login.fulfilled", () => {
    const store = makeStore();
    const payload = {
      token: "test-token",
      refreshToken: "test-refresh",
      role: "Admin",
      email: "admin@test.com",
      fullName: "Admin User",
      userId: 1,
    };

    store.dispatch({ type: login.fulfilled.type, payload });

    const { auth } = store.getState();
    expect(auth.token).toBe("test-token");
    expect(auth.role).toBe("Admin");
    expect(auth.email).toBe("admin@test.com");
    expect(auth.userId).toBe(1);
    expect(auth.loading).toBe(false);
  });

  it("persists token to localStorage on login.fulfilled", () => {
    const store = makeStore();
    const payload = {
      token: "my-token",
      refreshToken: "my-refresh",
      role: "Admin",
      email: "user@test.com",
      fullName: "User",
      userId: 5,
    };

    store.dispatch({ type: login.fulfilled.type, payload });

    expect(localStorage.getItem("token")).toBe("my-token");
    expect(localStorage.getItem("role")).toBe("Admin");
    expect(localStorage.getItem("userId")).toBe("5");
  });
});

describe("auth slice — logout thunk", () => {
  beforeEach(() => localStorage.clear());

  it("clears auth state on logout.fulfilled", () => {
    const store = makeStore({
      auth: {
        token: "tok",
        refreshToken: "ref",
        role: "Admin",
        email: "a@b.com",
        fullName: "Alice",
        userId: 1,
        loading: false,
      },
    });

    store.dispatch({ type: logout.fulfilled.type });

    const { auth } = store.getState();
    expect(auth.token).toBeNull();
    expect(auth.userId).toBeNull();
  });
});
