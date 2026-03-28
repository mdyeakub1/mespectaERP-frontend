import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAcquisitionTypes,
  createAcquisitionType,
  updateAcquisitionType,
  deleteAcquisitionType,
} from "./acquisitionTypes.api";
import type { AcquisitionType } from "./acquisitionTypes.types";

interface AcquisitionTypesState {
  data: AcquisitionType[];
  loading: boolean;
}

const initialState: AcquisitionTypesState = {
  data: [],
  loading: false,
};

export const fetchAcquisitionTypes = createAsyncThunk(
  "acquisitionTypes/fetchAll",
  async () => await getAcquisitionTypes()
);

export const addAcquisitionType = createAsyncThunk(
  "acquisitionTypes/add",
  async (data: { name: string }) => {
    await createAcquisitionType(data);
    return await getAcquisitionTypes();
  }
);

export const editAcquisitionType = createAsyncThunk(
  "acquisitionTypes/edit",
  async ({
    id,
    data,
  }: {
    id: number;
    data: { name: string };
  }) => {
    await updateAcquisitionType(id, data);
    return await getAcquisitionTypes();
  }
);

export const removeAcquisitionType = createAsyncThunk(
  "acquisitionTypes/delete",
  async (id: number) => {
    await deleteAcquisitionType(id);
    return await getAcquisitionTypes();
  }
);

const acquisitionTypesSlice = createSlice({
  name: "acquisitionTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcquisitionTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAcquisitionTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addAcquisitionType.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(editAcquisitionType.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(removeAcquisitionType.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default acquisitionTypesSlice.reducer;