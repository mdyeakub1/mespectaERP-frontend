import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, createProduct, updateProduct, deleteProduct, getProductById } from "./products.api";
import { extractError } from "../../utils/extractError";

interface ProductsState {
  data: any[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  loading: boolean;
  details: any | null;
  detailsLoading: boolean;
}

const initialState: ProductsState = {
  data: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  loading: false,
  details: null,
  detailsLoading: false,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params: any = {}, { rejectWithValue }) => {
    try {
      return await getProducts(params);
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to fetch products"));
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/getById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await getProductById(id);
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to load product details"));
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/add",
  async (data: any, { rejectWithValue }) => {
    try {
      await createProduct(data);
      return await getProducts();
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to create product"));
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/edit",
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      await updateProduct(id, data);
      return await getProducts();
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to update product"));
    }
  }
);

export const removeProduct = createAsyncThunk(
  "products/delete",
  async ({ id, params }: { id: number; params?: any }, { rejectWithValue }) => {
    try {
      await deleteProduct(id);
      return await getProducts(params);
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to delete product"));
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchProducts.rejected, (state) => { state.loading = false; })

      .addCase(addProduct.pending, (state) => { state.loading = true; })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(addProduct.rejected, (state) => { state.loading = false; })

      .addCase(editProduct.pending, (state) => { state.loading = true; })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.items;
      })
      .addCase(editProduct.rejected, (state) => { state.loading = false; })

      .addCase(removeProduct.pending, (state) => { state.loading = true; })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(removeProduct.rejected, (state) => { state.loading = false; })

      .addCase(fetchProductById.pending, (state) => { state.detailsLoading = true; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.details = action.payload;
      })
      .addCase(fetchProductById.rejected, (state) => { state.detailsLoading = false; });
  },
});

export default productsSlice.reducer;
