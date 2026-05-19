import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../utils/renderWithProviders";
import ProductsPage from "../../features/products/pages/ProductsPage";
import { mockProduct } from "../mocks/handlers";

describe("ProductsPage", () => {
  it("renders the search input", () => {
    renderWithProviders(<ProductsPage />, { initialRoute: "/products" });
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("renders the Add New button", () => {
    renderWithProviders(<ProductsPage />, { initialRoute: "/products" });
    expect(screen.getByRole("button", { name: /add new/i })).toBeInTheDocument();
  });

  it("loads and displays products from the API", async () => {
    renderWithProviders(<ProductsPage />, { initialRoute: "/products" });

    await waitFor(() => {
      expect(screen.getByText(mockProduct.productCode)).toBeInTheDocument();
    });
  });

  it("displays product description in the table", async () => {
    renderWithProviders(<ProductsPage />, { initialRoute: "/products" });

    await waitFor(() => {
      expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    });
  });

  it("opens the drawer when Add New is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductsPage />, { initialRoute: "/products" });

    await user.click(screen.getByRole("button", { name: /add new/i }));

    await waitFor(() => {
      // Drawer contains Product Code field
      expect(screen.getByText("Product Code")).toBeInTheDocument();
    });
  });
});
