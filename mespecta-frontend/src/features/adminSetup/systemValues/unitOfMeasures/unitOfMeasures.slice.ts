import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUnitOfMeasures,
  createUnitOfMeasure,
  updateUnitOfMeasure,
  deleteUnitOfMeasure,
} from "./unitOfMeasures.api";
import type { UnitOfMeasure } from "./unitOfMeasures.types";

interface UnitOfMeasuresState {
  data: UnitOfMeasure[];
  loading: boolean;
}

const initialState: UnitOfMeasuresState = {
  data: [],
  loading: false,
};

export const fetchUnitOfMeasures = createAsyncThunk(
  "unitOfMeasures/fetchAll",
  async () => await getUnitOfMeasures()
);

export const addUnitOfMeasure = createAsyncThunk(
  "unitOfMeasures/add",
  async (data: { name: string; code: string }) => {
    await createUnitOfMeasure(data);
    return await getUnitOfMeasures();
  }
);

export const editUnitOfMeasure = createAsyncThunk(
  "unitOfMeasures/edit",
  async ({
    id,
    data,
  }: {
    id: number;
    data: { name: string; code: string };
  }) => {
    await updateUnitOfMeasure(id, data);
    return await getUnitOfMeasures();
  }
);

export const removeUnitOfMeasure = createAsyncThunk(
  "unitOfMeasures/delete",
  async (id: number) => {
    await deleteUnitOfMeasure(id);
    return await getUnitOfMeasures();
  }
);

const unitOfMeasuresSlice = createSlice({
  name: "unitOfMeasures",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnitOfMeasures.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnitOfMeasures.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addUnitOfMeasure.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(editUnitOfMeasure.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(removeUnitOfMeasure.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default unitOfMeasuresSlice.reducer;