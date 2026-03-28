import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSources,
  createSource,
  updateSource,
  deleteSource,
} from "./sources.api";
import type { Source } from "./sources.types";

interface SourcesState {
  data: Source[];
  loading: boolean;
}

const initialState: SourcesState = {
  data: [],
  loading: false,
};

export const fetchSources = createAsyncThunk(
  "sources/fetchAll",
  async () => await getSources()
);

export const addSource = createAsyncThunk(
  "sources/add",
  async (data: { name: string }) => {
    await createSource(data);
    return await getSources();
  }
);

export const editSource = createAsyncThunk(
  "sources/edit",
  async ({
    id,
    data,
  }: {
    id: number;
    data: { name: string };
  }) => {
    await updateSource(id, data);
    return await getSources();
  }
);

export const removeSource = createAsyncThunk(
  "sources/delete",
  async (id: number) => {
    await deleteSource(id);
    return await getSources();
  }
);

const sourcesSlice = createSlice({
  name: "sources",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSources.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSources.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addSource.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(editSource.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(removeSource.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default sourcesSlice.reducer;