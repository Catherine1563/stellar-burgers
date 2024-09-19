import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface allIngredientsState {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | null;
}

const initialState: allIngredientsState = {
  ingredients: [],
  isIngredientsLoading: true,
  error: null
};

export const fetchAllIngredients = createAsyncThunk(
  'ingredients/fetchAllIngredients',
  async () => {
    const ingredients = await getIngredientsApi();
    return ingredients;
  }
);

const allIngredientsSlice = createSlice({
  name: 'all_ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(fetchAllIngredients.fulfilled, (state, action) => {
        const allIngredients = action.payload as TIngredient[];
        state.ingredients = allIngredients;
        state.isIngredientsLoading = false;
      })
      .addCase(fetchAllIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export default allIngredientsSlice.reducer;
