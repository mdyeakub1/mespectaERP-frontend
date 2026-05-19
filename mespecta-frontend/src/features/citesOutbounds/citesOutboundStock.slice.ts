import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { CitesOutboundStockItem, CitesOutboundStockFilter } from "./citesOutboundStock.types";
import { getCitesOutboundStock } from "./citesOutboundStock.api";
import { extractError } from "../../utils/extractError";

interface State {
  items: CitesOutboundStockItem[];
  totalCount: number;
  loading: boolean;
}

const initialState: State = {
  items: [],
  totalCount: 0,
  loading: false,
};

export const fetchCitesOutboundStock = createAsyncThunk(
  "citesOutboundStock/fetchAll",
  async (params: CitesOutboundStockFilter | undefined, { rejectWithValue }) => {
    try {
      return await getCitesOutboundStock(params);
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to fetch stock records"));
    }
  }
);

const slice = createSlice({
  name: "citesOutboundStock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCitesOutboundStock.pending, (state) => { state.loading = true; })
      .addCase(fetchCitesOutboundStock.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.items;
        state.totalCount = action.payload.data.totalCount;
      })
      .addCase(fetchCitesOutboundStock.rejected, (state) => { state.loading = false; });
  },
});

export default slice.reducer;
