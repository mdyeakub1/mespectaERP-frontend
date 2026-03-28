import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { getMyAccount } from "./account.api";

interface AccountState {
  data: any | null;
  loading: boolean;
}

const initialState: AccountState = {
  data: null,
  loading: false,
};

export const fetchAccount = createAsyncThunk(
  "account/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await getMyAccount();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load account"
      );
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAccount.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default accountSlice.reducer;