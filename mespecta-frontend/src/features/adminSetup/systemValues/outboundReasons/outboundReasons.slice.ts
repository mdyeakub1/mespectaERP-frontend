import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getOutboundReasons,
  createOutboundReason,
  updateOutboundReason,
  deleteOutboundReason,
} from "./outboundReasons.api";
import type { OutboundReason } from "./outboundReasons.types";

interface OutboundReasonsState {
  data: OutboundReason[];
  loading: boolean;
}

const initialState: OutboundReasonsState = {
  data: [],
  loading: false,
};

export const fetchOutboundReasons = createAsyncThunk(
  "outboundReasons/fetchAll",
  async () => await getOutboundReasons()
);

export const addOutboundReason = createAsyncThunk(
  "outboundReasons/add",
  async (data: { name: string }) => {
    await createOutboundReason(data);
    return await getOutboundReasons();
  }
);

export const editOutboundReason = createAsyncThunk(
  "outboundReasons/edit",
  async ({ id, data }: { id: number; data: { name: string } }) => {
    await updateOutboundReason(id, data);
    return await getOutboundReasons();
  }
);

export const removeOutboundReason = createAsyncThunk(
  "outboundReasons/delete",
  async (id: number) => {
    await deleteOutboundReason(id);
    return await getOutboundReasons();
  }
);

const outboundReasonsSlice = createSlice({
  name: "outboundReasons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutboundReasons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOutboundReasons.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOutboundReasons.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addOutboundReason.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(editOutboundReason.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(removeOutboundReason.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default outboundReasonsSlice.reducer;
