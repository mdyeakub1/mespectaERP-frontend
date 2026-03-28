import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "./suppliers.api";
import type { Supplier } from "./suppliers.types";

interface SuppliersState {
  items: Supplier[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  loading: boolean;
}

const initialState: SuppliersState = {
  items: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  loading: false,
};

/* ================= FETCH ================= */
export const fetchSuppliers = createAsyncThunk(
  "suppliers/fetch",
  async (params: any = {}, { rejectWithValue }) => {
    try {
      return await getSuppliers(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch suppliers"
      );
    }
  }
);

/* ================= ADD ================= */
export const addSupplier = createAsyncThunk(
  "suppliers/add",
  async (data: any, { rejectWithValue }) => {
    try {
      await createSupplier(data);
      return await getSuppliers();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Create failed"
      );
    }
  }
);

/* ================= EDIT ================= */
export const editSupplier = createAsyncThunk(
  "suppliers/edit",
  async (
    { id, data }: { id: number; data: any },
    { rejectWithValue }
  ) => {
    try {
      await updateSupplier(id, data);
      return await getSuppliers();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Update failed"
      );
    }
  }
);

/* ================= DELETE ================= */
export const removeSupplier = createAsyncThunk(
  "suppliers/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteSupplier(id);
      return await getSuppliers();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Delete failed"
      );
    }
  }
);

const suppliersSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchSuppliers.rejected, (state) => {
        state.loading = false;
      })

      .addCase(addSupplier.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })

      .addCase(editSupplier.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })

      .addCase(removeSupplier.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
      });
  },
});

export default suppliersSlice.reducer;