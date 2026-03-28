import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMaterialCategories,
  createMaterialCategory,
  updateMaterialCategory,
  deleteMaterialCategory,
} from "./materialCategories.api";
import type { MaterialCategory } from "./materialCategories.types";

interface MaterialCategoriesState {
  data: MaterialCategory[];
  loading: boolean;
}

const initialState: MaterialCategoriesState = {
  data: [],
  loading: false,
};

export const fetchMaterialCategories = createAsyncThunk(
  "materialCategories/fetchAll",
  async () => await getMaterialCategories()
);

export const addMaterialCategory = createAsyncThunk(
  "materialCategories/add",
  async (data: { name: string }) => {
    await createMaterialCategory(data);
    return await getMaterialCategories();
  }
);

export const editMaterialCategory = createAsyncThunk(
  "materialCategories/edit",
  async ({
    id,
    data,
  }: {
    id: number;
    data: { name: string };
  }) => {
    await updateMaterialCategory(id, data);
    return await getMaterialCategories();
  }
);

export const removeMaterialCategory = createAsyncThunk(
  "materialCategories/delete",
  async (id: number) => {
    await deleteMaterialCategory(id);
    return await getMaterialCategories();
  }
);

const materialCategoriesSlice = createSlice({
  name: "materialCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterialCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMaterialCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addMaterialCategory.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(editMaterialCategory.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(removeMaterialCategory.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default materialCategoriesSlice.reducer;