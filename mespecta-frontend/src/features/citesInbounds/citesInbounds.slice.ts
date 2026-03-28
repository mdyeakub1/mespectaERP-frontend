import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import type {
  CitesInboundResponse,
  CitesInboundFilter,
} from "./citesInbounds.types";
import { getCitesInbounds } from "./citesInbounds.api";

interface State {
  items: CitesInboundResponse[];
  totalCount: number;
  loading: boolean;
}

const initialState: State = {
  items: [],
  totalCount: 0,
  loading: false,
};

export const fetchCitesInbounds =
  createAsyncThunk(
    "citesInbounds/fetchAll",
    async (
      params: CitesInboundFilter | undefined,
      { rejectWithValue }
    ) => {
      try {
        return await getCitesInbounds(params);
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data
        );
      }
    }
  );

const slice = createSlice({
  name: "citesInbounds",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchCitesInbounds.pending,
        (state) => {
          state.loading = true;
        }
      )
      .addCase(
        fetchCitesInbounds.fulfilled,
        (state, action) => {
          state.loading = false;

          // 🔥 IMPORTANT: match backend response
          state.items =
            action.payload.data.items;

          state.totalCount =
            action.payload.data.totalCount;
        }
      )
      .addCase(
        fetchCitesInbounds.rejected,
        (state) => {
          state.loading = false;
        }
      );
  },
});

export default slice.reducer;