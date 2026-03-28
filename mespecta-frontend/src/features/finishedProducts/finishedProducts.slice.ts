import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  getFinishedProducts,
  getFinishedProductById,
  type FinishedProductFilter,
} from "./finishedProducts.api";

interface State {
  items: any[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  loading: boolean;

  details: any | null;
  detailsLoading: boolean;
}

const initialState: State = {
  items: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  loading: false,

  details: null,
  detailsLoading: false,
};

/* =============================
   LIST
============================= */
export const fetchFinishedProducts =
  createAsyncThunk(
    "finishedProducts/fetch",
    async (
      params: FinishedProductFilter | undefined,
      { rejectWithValue }
    ) => {
      try {
        return await getFinishedProducts(params);
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data
        );
      }
    }
  );

/* =============================
   DETAILS (GET BY ID)
============================= */
export const fetchFinishedProductById =
  createAsyncThunk(
    "finishedProducts/getById",
    async (
      id: number,
      { rejectWithValue }
    ) => {
      try {
        return await getFinishedProductById(id);
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data
        );
      }
    }
  );

const slice = createSlice({
  name: "finishedProducts",
  initialState,
  reducers: {
    clearFinishedProductDetails: (state) => {
      state.details = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ================= LIST ================= */
      .addCase(
        fetchFinishedProducts.pending,
        (state) => {
          state.loading = true;
        }
      )
      .addCase(
        fetchFinishedProducts.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload.items;
          state.totalCount =
            action.payload.totalCount;
          state.pageNumber =
            action.payload.pageNumber;
          state.pageSize =
            action.payload.pageSize;
        }
      )
      .addCase(
        fetchFinishedProducts.rejected,
        (state) => {
          state.loading = false;
        }
      )

      /* ================= DETAILS ================= */
      .addCase(
        fetchFinishedProductById.pending,
        (state) => {
          state.detailsLoading = true;
        }
      )
      .addCase(
        fetchFinishedProductById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.details = action.payload;
        }
      )
      .addCase(
        fetchFinishedProductById.rejected,
        (state) => {
          state.detailsLoading = false;
        }
      );
  },
});

export const {
  clearFinishedProductDetails,
} = slice.actions;

export default slice.reducer;