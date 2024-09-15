import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface IngredientModalState {
  selectedIngredient: TIngredient | null;
  isIngredientsLoading: boolean;
  error: string | null;
}

const initialState: IngredientModalState = {
  selectedIngredient: null,
  isIngredientsLoading: false,
  error: null
};

const ingredientModalSlice = createSlice({
  name: 'ingredient_modal',
  initialState,
  reducers: {
    setSelectedIngredient(state, action: PayloadAction<TIngredient | null>) {
      state.selectedIngredient = action.payload;
      state.isIngredientsLoading = false;
    },
    selectIngredientById(
      state,
      action: PayloadAction<{ id: string; ingredients: TIngredient[] }>
    ) {
      state.isIngredientsLoading = true;
      const { id, ingredients } = action.payload;
      state.selectedIngredient =
        ingredients.find((ingredient) => ingredient._id === id) || null;
      state.isIngredientsLoading = false;
    }
  }
});

export const { setSelectedIngredient, selectIngredientById } =
  ingredientModalSlice.actions;
export default ingredientModalSlice.reducer;
