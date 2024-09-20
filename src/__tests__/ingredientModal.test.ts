import ingredientModalReducer, {
  selectIngredientById
} from '../slices/ingredientModalSlice';
import { TIngredient } from '@utils-types';

describe('Ingredient modal', () => {
  const initialState = {
    selectedIngredient: null,
    error: null
  };
  it('должен устанавливать выбранный ингредиент по id', () => {
    const ingredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 10,
        fat: 10,
        carbohydrates: 10,
        calories: 10,
        price: 100,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      }
    ];

    const action = selectIngredientById({
      id: '1',
      ingredients: ingredients
    });
    const state = ingredientModalReducer(initialState, action);

    expect(state.selectedIngredient).toEqual({
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 10,
      price: 100,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    });
  });
});
