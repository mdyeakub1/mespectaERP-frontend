import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getOutgoingDocumentTypes,
  createOutgoingDocumentType,
  updateOutgoingDocumentType,
  deleteOutgoingDocumentType,
} from "./outgoingDocumentTypes.api";
import type { OutgoingDocumentType } from "./outgoingDocumentTypes.types";

interface OutgoingDocumentTypesState {
  data: OutgoingDocumentType[];
  loading: boolean;
}

const initialState: OutgoingDocumentTypesState = {
  data: [],
  loading: false,
};

export const fetchOutgoingDocumentTypes = createAsyncThunk(
  "outgoingDocumentTypes/fetchAll",
  async () => await getOutgoingDocumentTypes()
);

export const addOutgoingDocumentType = createAsyncThunk(
  "outgoingDocumentTypes/add",
  async (data: { name: string }) => {
    await createOutgoingDocumentType(data);
    return await getOutgoingDocumentTypes();
  }
);

export const editOutgoingDocumentType = createAsyncThunk(
  "outgoingDocumentTypes/edit",
  async ({ id, data }: { id: number; data: { name: string } }) => {
    await updateOutgoingDocumentType(id, data);
    return await getOutgoingDocumentTypes();
  }
);

export const removeOutgoingDocumentType = createAsyncThunk(
  "outgoingDocumentTypes/delete",
  async (id: number) => {
    await deleteOutgoingDocumentType(id);
    return await getOutgoingDocumentTypes();
  }
);

const outgoingDocumentTypesSlice = createSlice({
  name: "outgoingDocumentTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutgoingDocumentTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOutgoingDocumentTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOutgoingDocumentTypes.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addOutgoingDocumentType.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(editOutgoingDocumentType.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(removeOutgoingDocumentType.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default outgoingDocumentTypesSlice.reducer;
