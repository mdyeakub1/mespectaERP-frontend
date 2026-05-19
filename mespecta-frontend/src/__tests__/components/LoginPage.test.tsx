import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../utils/renderWithProviders";
import LoginPage from "../../features/auth/LoginPage";

describe("LoginPage", () => {
  it("renders the sign-in form", () => {
    renderWithProviders(<LoginPage />, { initialRoute: "/login" });
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { initialRoute: "/login" });

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("shows email format validation error for invalid email", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { initialRoute: "/login" });

    await user.type(screen.getByPlaceholderText("you@example.com"), "not-an-email");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
    });
  });

  it("successfully logs in with valid credentials", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { initialRoute: "/login" });

    await user.type(screen.getByPlaceholderText("you@example.com"), "admin@test.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // MSW handler returns success, so no error alert should appear
    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
