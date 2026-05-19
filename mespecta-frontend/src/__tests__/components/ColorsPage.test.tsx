import { describe, it, expect } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../utils/renderWithProviders";
import ColorsPage from "../../features/adminSetup/systemValues/colors/pages/ColorsPage";

describe("ColorsPage", () => {
  it("renders the page title", () => {
    renderWithProviders(<ColorsPage />);
    expect(screen.getByText("Colors")).toBeInTheDocument();
  });

  it("renders the Add New button", () => {
    renderWithProviders(<ColorsPage />);
    expect(screen.getByRole("button", { name: /add new/i })).toBeInTheDocument();
  });

  it("loads and displays colors from the API", async () => {
    renderWithProviders(<ColorsPage />);

    // MSW returns [{ colorId: 1, name: "Brown" }]
    await waitFor(() => {
      expect(screen.getByText("Brown")).toBeInTheDocument();
    });
  });

  it("opens the Add Color modal when Add New is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ColorsPage />);

    await user.click(screen.getByRole("button", { name: /add new/i }));

    await waitFor(() => {
      expect(screen.getByText("Add Color")).toBeInTheDocument();
    });
  });

  it("shows validation error when trying to save with empty name", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ColorsPage />);

    await user.click(screen.getByRole("button", { name: /add new/i }));
    await waitFor(() => screen.getByText("Add Color"));

    // Click Save without filling in the name
    const modal = screen.getByRole("dialog");
    const saveBtn = within(modal).getByRole("button", { name: /save/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("opens the Edit modal pre-filled when edit icon is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ColorsPage />);

    // Wait for the Brown row to appear
    await waitFor(() => screen.getByText("Brown"));

    // Click the edit icon (EditOutlined) — it's the first action icon in the row
    const editIcons = screen.getAllByRole("img", { hidden: true });
    const editIcon = editIcons.find((el) => el.closest("[aria-label='edit']") || el.closest(".anticon-edit"));
    // Fall back: just click the first anticon-edit
    const editBtn = document.querySelector(".anticon-edit") as HTMLElement;
    await user.click(editBtn);

    await waitFor(() => {
      expect(screen.getByText("Edit Color")).toBeInTheDocument();
    });

    // Input should be pre-filled with "Brown"
    const input = screen.getByRole("textbox");
    expect((input as HTMLInputElement).value).toBe("Brown");
  });

  it("successfully creates a new color via the modal", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ColorsPage />);

    await user.click(screen.getByRole("button", { name: /add new/i }));
    await waitFor(() => screen.getByText("Add Color"));

    await user.type(screen.getByRole("textbox"), "Green");

    const modal = screen.getByRole("dialog");
    const saveBtn = within(modal).getByRole("button", { name: /save/i });
    await user.click(saveBtn);

    // jsdom doesn't run CSS animations so the modal never fully unmounts — instead
    // verify the success message toast appears (proves the API call succeeded).
    await waitFor(() => {
      expect(screen.getByText("Color created successfully")).toBeInTheDocument();
    });
  });
});
