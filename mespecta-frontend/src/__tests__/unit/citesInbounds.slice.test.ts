import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import citesInboundsReducer, { fetchCitesInbounds } from "../../features/citesInbounds/citesInbounds.slice";

function makeStore() {
  return configureStore({ reducer: { citesInbounds: citesInboundsReducer } });
}

const pagedPayload = {
  success: true,
  data: {
    items: [
      {
        citesInboundId: 1,
        citesInboundSerialNo: "CI-2024-001",
        scientificName: "Python regius",
        commonName: "Ball Python",
        leatherTypeName: "Snake",
        colorName: "Brown",
        quantityReceived: 10,
        unitOfMeasureName: "MT",
        numberOfSkins: 5,
        citesNumber: "CITES-001",
        issueDate: "2024-01-15T00:00:00Z",
        documentTypeName: "Export Permit",
        acquisitionTypeName: "Wild",
        sourceName: "Supplier A",
        identification: "TAG-001",
        citesDetails: "Test details",
        notes: "Test notes",
      },
    ],
    totalCount: 1,
    pageNumber: 1,
    pageSize: 10,
  },
};

describe("citesInbounds slice — initial state", () => {
  it("starts with empty items, zero totalCount, loading=false", () => {
    const store = makeStore();
    const state = store.getState().citesInbounds;
    expect(state.items).toEqual([]);
    expect(state.totalCount).toBe(0);
    expect(state.loading).toBe(false);
  });
});

describe("citesInbounds slice — fetchCitesInbounds", () => {
  it("sets loading=true on pending", () => {
    const store = makeStore();
    store.dispatch({ type: fetchCitesInbounds.pending.type });
    expect(store.getState().citesInbounds.loading).toBe(true);
  });

  it("populates items and totalCount on fulfilled", () => {
    const store = makeStore();
    store.dispatch({ type: fetchCitesInbounds.fulfilled.type, payload: pagedPayload });
    const state = store.getState().citesInbounds;
    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(1);
    expect(state.items[0].citesInboundSerialNo).toBe("CI-2024-001");
    expect(state.totalCount).toBe(1);
  });

  it("sets loading=false on rejected", () => {
    const store = makeStore();
    store.dispatch({ type: fetchCitesInbounds.pending.type });
    store.dispatch({ type: fetchCitesInbounds.rejected.type });
    expect(store.getState().citesInbounds.loading).toBe(false);
  });

  it("updates items when a second fetch returns a different page", () => {
    const store = makeStore();
    store.dispatch({ type: fetchCitesInbounds.fulfilled.type, payload: pagedPayload });

    const page2Payload = {
      ...pagedPayload,
      data: {
        ...pagedPayload.data,
        items: [{ ...pagedPayload.data.items[0], citesInboundId: 2, citesInboundSerialNo: "CI-2024-002" }],
        pageNumber: 2,
      },
    };
    store.dispatch({ type: fetchCitesInbounds.fulfilled.type, payload: page2Payload });

    const state = store.getState().citesInbounds;
    expect(state.items).toHaveLength(1);
    expect(state.items[0].citesInboundSerialNo).toBe("CI-2024-002");
  });
});
