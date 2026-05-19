import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
} from "./destinations.api";
import type { Destination } from "./destinations.types";

interface DestinationsState {
  data: Destination[];
  loading: boolean;
}

const initialState: DestinationsState = {
  data: [],
  loading: false,
};

export const fetchDestinations = createAsyncThunk(
  "destinations/fetchAll",
  async () => await getDestinations()
);

export const addDestination = createAsyncThunk(
  "destinations/add",
  async (data: { name: string }) => {
    await createDestination(data);
    return await getDestinations();
  }
);

export const editDestination = createAsyncThunk(
  "destinations/edit",
  async ({ id, data }: { id: number; data: { name: string } }) => {
    await updateDestination(id, data);
    return await getDestinations();
  }
);

export const removeDestination = createAsyncThunk(
  "destinations/delete",
  async (id: number) => {
    await deleteDestination(id);
    return await getDestinations();
  }
);

const destinationsSlice = createSlice({
  name: "destinations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDestinations.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addDestination.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(editDestination.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(removeDestination.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default destinationsSlice.reducer;
