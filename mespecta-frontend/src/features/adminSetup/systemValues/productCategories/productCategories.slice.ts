import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from "./productCategories.api";
import type { ProductCategory } from "./productCategories.types";

interface ProductCategoriesState {
  data: ProductCategory[];
  loading: boolean;
}

const initialState: ProductCategoriesState = {
  data: [],
  loading: false,
};

export const fetchProductCategories = createAsyncThunk(
  "productCategories/fetchAll",
  async () => await getProductCategories()
);

export const addProductCategory = createAsyncThunk(
  "productCategories/add",
  async (data: { name: string; isActive: boolean }) => {
    await createProductCategory(data);
    return await getProductCategories();
  }
);

export const editProductCategory = createAsyncThunk(
  "productCategories/edit",
  async ({
    id,
    data,
  }: {
    id: number;
    data: { name: string; isActive: boolean };
  }) => {
    await updateProductCategory(id, data);
    return await getProductCategories();
  }
);

export const removeProductCategory = createAsyncThunk(
  "productCategories/delete",
  async (id: number) => {
    await deleteProductCategory(id);
    return await getProductCategories();
  }
);

const productCategoriesSlice = createSlice({
  name: "productCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addProductCategory.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(editProductCategory.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(removeProductCategory.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default productCategoriesSlice.reducer;