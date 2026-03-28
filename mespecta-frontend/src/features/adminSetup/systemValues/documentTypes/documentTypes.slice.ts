import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDocumentTypes,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
} from "./documentTypes.api";
import type { DocumentType } from "./documentTypes.types";

interface DocumentTypesState {
  data: DocumentType[];
  loading: boolean;
}

const initialState: DocumentTypesState = {
  data: [],
  loading: false,
};

export const fetchDocumentTypes = createAsyncThunk(
  "documentTypes/fetchAll",
  async () => await getDocumentTypes()
);

export const addDocumentType = createAsyncThunk(
  "documentTypes/add",
  async (data: { name: string }) => {
    await createDocumentType(data);
    return await getDocumentTypes();
  }
);

export const editDocumentType = createAsyncThunk(
  "documentTypes/edit",
  async ({
    id,
    data,
  }: {
    id: number;
    data: { name: string };
  }) => {
    await updateDocumentType(id, data);
    return await getDocumentTypes();
  }
);

export const removeDocumentType = createAsyncThunk(
  "documentTypes/delete",
  async (id: number) => {
    await deleteDocumentType(id);
    return await getDocumentTypes();
  }
);

const documentTypesSlice = createSlice({
  name: "documentTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocumentTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addDocumentType.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(editDocumentType.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(removeDocumentType.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default documentTypesSlice.reducer;