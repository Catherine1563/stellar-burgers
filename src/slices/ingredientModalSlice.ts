import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface IngredientModalState {
  ingredientsModal: TIngredient[];
  selectedIngredient: TIngredient | null;
  isIngredientsLoading: boolean;
  error: string | null;
}

const initialState: IngredientModalState = {
  ingredientsModal: [],
  selectedIngredient: null,
  isIngredientsLoading: false,
  error: null
};

export const fetchIngredientsModal = createAsyncThunk(
  'ingredients/fetchIngredientsModal',
  async () => {
    const ingredients = await getIngredientsApi();
    return ingredients;
  }
);

const ingredientModalSlice = createSlice({
  name: 'ingredient_modal',
  initialState,
  reducers: {
    setSelectedIngredient(state, action: PayloadAction<TIngredient | null>) {
      state.selectedIngredient = action.payload;
    },
    selectIngredientById(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.selectedIngredient =
        state.ingredientsModal.find((ingredient) => ingredient._id === id) ||
        null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsModal.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredientsModal.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        const ingredients = action.payload as TIngredient[];
        state.ingredientsModal = ingredients;
      })
      .addCase(fetchIngredientsModal.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export const { setSelectedIngredient, selectIngredientById } =
  ingredientModalSlice.actions;
export default ingredientModalSlice.reducer;
