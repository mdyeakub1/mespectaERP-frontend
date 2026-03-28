import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getLeatherTypes,
  createLeatherType,
  updateLeatherType,
  deleteLeatherType,
} from "./leatherTypes.api";
import type { LeatherType } from "./leatherTypes.types";

interface LeatherTypesState {
  data: LeatherType[];
  loading: boolean;
}

const initialState: LeatherTypesState = {
  data: [],
  loading: false,
};

export const fetchLeatherTypes = createAsyncThunk(
  "leatherTypes/fetchAll",
  async () => await getLeatherTypes()
);

export const addLeatherType = createAsyncThunk(
  "leatherTypes/add",
  async (data: { name: string }) => {
    await createLeatherType(data);
    return await getLeatherTypes();
  }
);

export const editLeatherType = createAsyncThunk(
  "leatherTypes/edit",
  async ({
    id,
    data,
  }: {
    id: number;
    data: { name: string };
  }) => {
    await updateLeatherType(id, data);
    return await getLeatherTypes();
  }
);

export const removeLeatherType = createAsyncThunk(
  "leatherTypes/delete",
  async (id: number) => {
    await deleteLeatherType(id);
    return await getLeatherTypes();
  }
);

const leatherTypesSlice = createSlice({
  name: "leatherTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeatherTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeatherTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLeatherTypes.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addLeatherType.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(editLeatherType.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(removeLeatherType.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default leatherTypesSlice.reducer;