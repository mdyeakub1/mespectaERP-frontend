import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { CitesOutboundSoldItem, CitesOutboundSoldFilter } from "./citesOutboundSold.types";
import { getCitesOutboundSold } from "./citesOutboundSold.api";
import { extractError } from "../../utils/extractError";

interface State {
  items: CitesOutboundSoldItem[];
  totalCount: number;
  loading: boolean;
}

const initialState: State = {
  items: [],
  totalCount: 0,
  loading: false,
};

export const fetchCitesOutboundSold = createAsyncThunk(
  "citesOutboundSold/fetchAll",
  async (params: CitesOutboundSoldFilter | undefined, { rejectWithValue }) => {
    try {
      return await getCitesOutboundSold(params);
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to fetch sold outbound records"));
    }
  }
);

const slice = createSlice({
  name: "citesOutboundSold",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCitesOutboundSold.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCitesOutboundSold.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data.items;
        state.totalCount = action.payload.data.totalCount;
      })
      .addCase(fetchCitesOutboundSold.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default slice.reducer;
