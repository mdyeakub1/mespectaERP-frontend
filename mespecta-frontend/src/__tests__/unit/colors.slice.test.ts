import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import colorsReducer, { fetchColors, addColor, editColor, removeColor } from "../../features/adminSetup/systemValues/colors/colors.slice";

function makeStore() {
  return configureStore({ reducer: { colors: colorsReducer } });
}

const sampleColors = [
  { colorId: 1, name: "Brown", createdAt: "2024-01-01T00:00:00Z" },
  { colorId: 2, name: "Black", createdAt: "2024-01-02T00:00:00Z" },
];

describe("colors slice — initial state", () => {
  it("starts with empty data and loading=false", () => {
    const store = makeStore();
    const { colors } = store.getState();
    expect(colors.data).toEqual([]);
    expect(colors.loading).toBe(false);
  });
});

describe("colors slice — fetchColors", () => {
  it("sets loading=true on pending", () => {
    const store = makeStore();
    store.dispatch({ type: fetchColors.pending.type });
    expect(store.getState().colors.loading).toBe(true);
  });

  it("sets data and loading=false on fulfilled", () => {
    const store = makeStore();
    store.dispatch({ type: fetchColors.fulfilled.type, payload: sampleColors });
    const { colors } = store.getState();
    expect(colors.loading).toBe(false);
    expect(colors.data).toHaveLength(2);
    expect(colors.data[0].name).toBe("Brown");
  });

  it("sets loading=false on rejected", () => {
    const store = makeStore();
    store.dispatch({ type: fetchColors.pending.type });
    store.dispatch({ type: fetchColors.rejected.type });
    expect(store.getState().colors.loading).toBe(false);
  });
});

describe("colors slice — addColor / editColor / removeColor", () => {
  it("replaces data on addColor.fulfilled", () => {
    const store = makeStore();
    const newList = [{ colorId: 3, name: "Red", createdAt: "2024-01-03T00:00:00Z" }];
    store.dispatch({ type: addColor.fulfilled.type, payload: newList });
    expect(store.getState().colors.data).toEqual(newList);
  });

  it("replaces data on editColor.fulfilled", () => {
    const store = makeStore();
    // Seed with original list
    store.dispatch({ type: fetchColors.fulfilled.type, payload: sampleColors });
    // Simulate server returning updated list
    const updated = [{ colorId: 1, name: "Dark Brown", createdAt: "2024-01-01T00:00:00Z" }];
    store.dispatch({ type: editColor.fulfilled.type, payload: updated });
    expect(store.getState().colors.data[0].name).toBe("Dark Brown");
  });

  it("replaces data on removeColor.fulfilled", () => {
    const store = makeStore();
    store.dispatch({ type: fetchColors.fulfilled.type, payload: sampleColors });
    // Server returns list without deleted item
    const afterDelete = [sampleColors[1]];
    store.dispatch({ type: removeColor.fulfilled.type, payload: afterDelete });
    expect(store.getState().colors.data).toHaveLength(1);
    expect(store.getState().colors.data[0].colorId).toBe(2);
  });
});
