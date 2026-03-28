import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  getCraftsmen,
  getCraftsmanById,
} from "./craftsmen.api";

interface State {
  items: any[];
  loading: boolean;

  details: any | null;
  detailsLoading: boolean;
}

const initialState: State = {
  items: [],
  loading: false,

  details: null,
  detailsLoading: false,
};

/* ------------------------------
   LIST
------------------------------ */
export const fetchCraftsmen =
  createAsyncThunk(
    "craftsmen/fetch",
    async () => await getCraftsmen()
  );

/* ------------------------------
   DETAILS
------------------------------ */
export const fetchCraftsmanById =
  createAsyncThunk(
    "craftsmen/getById",
    async (id: number) =>
      await getCraftsmanById(id)
  );

const slice = createSlice({
  name: "craftsmen",
  initialState,
  reducers: {
    clearCraftsmanDetails: (state) => {
      state.details = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* LIST */
      .addCase(
        fetchCraftsmen.pending,
        (state) => {
          state.loading = true;
        }
      )
      .addCase(
        fetchCraftsmen.fulfilled,
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        }
      )

      /* DETAILS */
      .addCase(
        fetchCraftsmanById.pending,
        (state) => {
          state.detailsLoading = true;
        }
      )
      .addCase(
        fetchCraftsmanById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.details = action.payload;
        }
      );
  },
});

export const {
  clearCraftsmanDetails,
} = slice.actions;

export default slice.reducer;