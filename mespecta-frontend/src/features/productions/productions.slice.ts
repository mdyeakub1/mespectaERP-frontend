import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProductions,
  startProduction,
  type ProductionFilter,
} from "./productions.api";
import type { Production } from "./productions.types";

interface State {
  data: Production[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  loading: boolean;
}

const initialState: State = {
  data: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  loading: false,
};

export const fetchProductions = createAsyncThunk(
  "productions/fetchAll",
  async (
    params: ProductionFilter | undefined,
    { rejectWithValue }
  ) => {
    try {
      return await getProductions(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createProduction = createAsyncThunk(
  "productions/start",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await startProduction(payload);
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const slice = createSlice({
  name: "productions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductions.fulfilled, (state, action) => {
        state.loading = false;

        // 🔥 MATCH YOUR BACKEND FORMAT
        state.data = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchProductions.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default slice.reducer;