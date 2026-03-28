import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "./customers.api";
import type { Customer } from "./customer.types";

interface CustomersState {
  items: Customer[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  loading: boolean;
}

const initialState: CustomersState = {
  items: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  loading: false,
};

/* ================= FETCH ================= */
export const fetchCustomers = createAsyncThunk(
  "customers/fetch",
  async (params: any = {}, { rejectWithValue }) => {
    try {
      return await getCustomers(params);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch customers"
      );
    }
  }
);

/* ================= ADD ================= */
export const addCustomer = createAsyncThunk(
  "customers/add",
  async (data: any, { rejectWithValue }) => {
    try {
      await createCustomer(data);
      return await getCustomers();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Create failed"
      );
    }
  }
);

/* ================= EDIT ================= */
export const editCustomer = createAsyncThunk(
  "customers/edit",
  async (
    { id, data }: { id: number; data: any },
    { rejectWithValue }
  ) => {
    try {
      await updateCustomer(id, data);
      return await getCustomers();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Update failed"
      );
    }
  }
);

/* ================= DELETE ================= */
export const removeCustomer = createAsyncThunk(
  "customers/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteCustomer(id);
      return await getCustomers();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  }
);

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchCustomers.rejected, (state) => {
        state.loading = false;
      })

      /* ADD */
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })

      /* EDIT */
      .addCase(editCustomer.fulfilled, (state, action) => {
        state.items = action.payload.items;
      })

      /* DELETE */
      .addCase(removeCustomer.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalCount = action.payload.totalCount;
      });
  },
});

export default customersSlice.reducer;