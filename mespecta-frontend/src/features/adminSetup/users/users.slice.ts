import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers, createUser, updateUser, deleteUser } from "./users.api";
import { extractError } from "../../../utils/extractError";
import type { UserFilter } from "./users.api";

interface State {
  items: any[];
  totalCount: number;
  loading: boolean;
  mutating: boolean;
}

const initialState: State = {
  items: [],
  totalCount: 0,
  loading: false,
  mutating: false,
};

export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (filter: UserFilter = {}, { rejectWithValue }) => {
    try {
      return await getUsers(filter);
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to fetch users"));
    }
  }
);

export const addUser = createAsyncThunk(
  "users/add",
  async (data: any, { rejectWithValue }) => {
    try {
      return await createUser(data);
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to create user"));
    }
  }
);

export const editUser = createAsyncThunk(
  "users/edit",
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      return await updateUser(id, data);
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to update user"));
    }
  }
);

export const removeUser = createAsyncThunk(
  "users/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      return await deleteUser(id);
    } catch (error: any) {
      return rejectWithValue(extractError(error, "Failed to delete user"));
    }
  }
);

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? action.payload ?? [];
        state.totalCount = action.payload.totalCount ?? 0;
      })
      .addCase(fetchUsers.rejected, (state) => { state.loading = false; })

      .addCase(addUser.pending, (state) => { state.mutating = true; })
      .addCase(addUser.fulfilled, (state) => { state.mutating = false; })
      .addCase(addUser.rejected, (state) => { state.mutating = false; })

      .addCase(editUser.pending, (state) => { state.mutating = true; })
      .addCase(editUser.fulfilled, (state) => { state.mutating = false; })
      .addCase(editUser.rejected, (state) => { state.mutating = false; })

      .addCase(removeUser.pending, (state) => { state.mutating = true; })
      .addCase(removeUser.fulfilled, (state) => { state.mutating = false; })
      .addCase(removeUser.rejected, (state) => { state.mutating = false; });
  },
});

export default slice.reducer;
