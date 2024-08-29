import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TOrder } from '@utils-types';

interface addIngredientState {
  bun:
    | {
        _id: string;
        name: string | null;
        image: string | null;
        price: number;
      }
    | undefined;
  arrIngredients: TIngredient[];
  error: string | null;
}

const initialState: addIngredientState = {
  bun: undefined,
  arrIngredients: [],
  error: null
};

const addIngredientSlice = createSlice({
  name: 'add_ingredient',
  initialState,
  reducers: {
    handleAddIngredient(state, action: PayloadAction<TIngredient | null>) {
      if (action.payload) {
        if (
          action.payload._id === '643d69a5c3f7b9001cfa093d' ||
          action.payload._id === '643d69a5c3f7b9001cfa093c'
        ) {
          state.bun = {
            _id: action.payload._id,
            name: action.payload.name,
            image: action.payload.image,
            price: action.payload.price
          };
        } else {
          state.arrIngredients.push(action.payload);
        }
      }
    },
    resetIngredients(state) {
      state.arrIngredients = [];
      state.bun = undefined;
    },
    handleDeleteIngredient(
      state,
      action: PayloadAction<{ ingredient: TIngredient; index: number }>
    ) {
      const { index } = action.payload;
      state.arrIngredients.splice(index, 1);
    },
    handleMoveDownIngredient(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index < state.arrIngredients.length - 1) {
        const temp = state.arrIngredients[index];
        state.arrIngredients[index] = state.arrIngredients[index + 1];
        state.arrIngredients[index + 1] = temp;
      }
    },
    handleMoveUpIngredient(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index > 0) {
        const temp = state.arrIngredients[index];
        state.arrIngredients[index] = state.arrIngredients[index - 1];
        state.arrIngredients[index - 1] = temp;
      }
    }
  }
});

export const {
  handleAddIngredient,
  resetIngredients,
  handleDeleteIngredient,
  handleMoveDownIngredient,
  handleMoveUpIngredient
} = addIngredientSlice.actions;
export default addIngredientSlice.reducer;
