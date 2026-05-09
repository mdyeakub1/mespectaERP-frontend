import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import type {
  CitesInboundResponse,
  CitesInboundFilter,
} from "./citesInbounds.types";
import { getCitesInbounds, createCitesInbound } from "./citesInbounds.api";
import { extractError } from "../../utils/extractError";

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

export const addCitesInbound = createAsyncThunk(
  "citesInbounds/add",
  async (data: any, { rejectWithValue }) => {
    try {
      return await createCitesInbound(data);
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to create CITES inbound"));
    }
  }
);

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
          extractError(error, "Failed to fetch CITES inbounds")
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