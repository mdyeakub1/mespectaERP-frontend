import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getColors,
  createColor,
  updateColor,
  deleteColor,
} from "./colors.api";
import type { Color } from "./colors.types";

interface ColorsState {
  data: Color[];
  loading: boolean;
}

const initialState: ColorsState = {
  data: [],
  loading: false,
};

export const fetchColors = createAsyncThunk(
  "colors/fetchAll",
  async () => await getColors()
);

export const addColor = createAsyncThunk(
  "colors/add",
  async (data: { name: string }) => {
    await createColor(data);
    return await getColors();
  }
);

export const editColor = createAsyncThunk(
  "colors/edit",
  async ({
    id,
    data,
  }: {
    id: number;
    data: { name: string };
  }) => {
    await updateColor(id, data);
    return await getColors();
  }
);

export const removeColor = createAsyncThunk(
  "colors/delete",
  async (id: number) => {
    await deleteColor(id);
    return await getColors();
  }
);

const colorsSlice = createSlice({
  name: "colors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchColors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchColors.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addColor.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(editColor.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(removeColor.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default colorsSlice.reducer;