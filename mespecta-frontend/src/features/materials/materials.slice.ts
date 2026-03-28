import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "./materials.api";
import type { Material } from "./materials.types";

interface MaterialsState {
  data: Material[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  loading: boolean;
}

const initialState: MaterialsState = {
  data: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  loading: false,
};

/* ================= FETCH ================= */
export const fetchMaterials = createAsyncThunk(
  "materials/fetchAll",
  async (params: any = {}, { rejectWithValue }) => {
    try {
      return await getMaterials(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch materials"
      );
    }
  }
);

/* ================= ADD ================= */
export const addMaterial = createAsyncThunk(
  "materials/add",
  async (data: any, { rejectWithValue }) => {
    try {
      await createMaterial(data);
      return await getMaterials();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

/* ================= EDIT ================= */
export const editMaterial = createAsyncThunk(
  "materials/edit",
  async (
    { id, data }: { id: number; data: any },
    { rejectWithValue }
  ) => {
    try {
      await updateMaterial(id, data);
      return await getMaterials();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

/* ================= DELETE ================= */
export const removeMaterial = createAsyncThunk(
  "materials/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteMaterial(id);
      return await getMaterials();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const materialsSlice = createSlice({
  name: "materials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchMaterials.rejected, (state) => {
        state.loading = false;
      })

      /* ADD */
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.data = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })

      /* EDIT */
      .addCase(editMaterial.fulfilled, (state, action) => {
        state.data = action.payload.items;
      })

      /* DELETE */
      .addCase(removeMaterial.fulfilled, (state, action) => {
        state.data = action.payload.items;
        state.totalCount = action.payload.totalCount;
      });
  },
});

export default materialsSlice.reducer;