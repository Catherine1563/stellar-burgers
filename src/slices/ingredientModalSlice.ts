import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface IngredientModalState {
  selectedIngredient: TIngredient | null;
  error: string | null;
}

const initialState: IngredientModalState = {
  selectedIngredient: null,
  error: null
};

const ingredientModalSlice = createSlice({
  name: 'ingredient_modal',
  initialState,
  reducers: {
    selectIngredientById(
      state,
      action: PayloadAction<{ id: string; ingredients: TIngredient[] }>
    ) {
      const { id, ingredients } = action.payload;
      state.selectedIngredient =
        ingredients.find((ingredient) => ingredient._id === id) || null;
    }
  }
});

export const { selectIngredientById } = ingredientModalSlice.actions;
export default ingredientModalSlice.reducer;
