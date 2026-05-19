import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../utils/renderWithProviders";
import CitesInboundsPage from "../../features/citesInbounds/pages/CitesInboundsPage";
import { mockCitesInbound } from "../mocks/handlers";

describe("CitesInboundsPage", () => {
  it("renders the search input", () => {
    renderWithProviders(<CitesInboundsPage />, { initialRoute: "/cites-inbounds" });
    expect(screen.getByPlaceholderText("Search CITES")).toBeInTheDocument();
  });

  it("renders the Add New button", () => {
    renderWithProviders(<CitesInboundsPage />, { initialRoute: "/cites-inbounds" });
    expect(screen.getByRole("button", { name: /add new/i })).toBeInTheDocument();
  });

  it("renders export buttons", () => {
    renderWithProviders(<CitesInboundsPage />, { initialRoute: "/cites-inbounds" });
    expect(screen.getByRole("button", { name: /export excel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /export pdf/i })).toBeInTheDocument();
  });

  it("loads and displays CITES inbound records from the API", async () => {
    renderWithProviders(<CitesInboundsPage />, { initialRoute: "/cites-inbounds" });

    // MSW returns mockCitesInbound with serialNo "CI-2024-001"
    await waitFor(() => {
      expect(screen.getByText(mockCitesInbound.citesInboundSerialNo)).toBeInTheDocument();
    });
  });

  it("displays the scientific name in the table", async () => {
    renderWithProviders(<CitesInboundsPage />, { initialRoute: "/cites-inbounds" });

    await waitFor(() => {
      expect(screen.getByText(mockCitesInbound.scientificName)).toBeInTheDocument();
    });
  });

  it("displays the common name in the table", async () => {
    renderWithProviders(<CitesInboundsPage />, { initialRoute: "/cites-inbounds" });

    await waitFor(() => {
      expect(screen.getByText(mockCitesInbound.commonName)).toBeInTheDocument();
    });
  });

  it("renders a Details button for each row", async () => {
    renderWithProviders(<CitesInboundsPage />, { initialRoute: "/cites-inbounds" });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /details/i })).toBeInTheDocument();
    });
  });

  it("opens the Filter modal when Filter button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CitesInboundsPage />, { initialRoute: "/cites-inbounds" });

    await user.click(screen.getByRole("button", { name: /filter/i }));

    await waitFor(() => {
      expect(screen.getByText("Filter CITES Inbounds")).toBeInTheDocument();
    });
  });

  it("opens the Add New modal when Add New is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CitesInboundsPage />, { initialRoute: "/cites-inbounds" });

    await user.click(screen.getByRole("button", { name: /add new/i }));

    // The AddCitesInboundModal should appear
    await waitFor(() => {
      // Modal title depends on AddCitesInboundModal — look for any modal
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});
