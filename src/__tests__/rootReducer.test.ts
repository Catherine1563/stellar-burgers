import { configureStore } from '@reduxjs/toolkit';
import store, { RootState } from '../services/store';
import ingredientsReducer from '../slices/allIngredientsCategorySlice';
import ingredientModalReducer from '../slices/ingredientModalSlice';
import addIngredientReducer from '../slices/addIngredientSlice';
import addFeedReducer from '../slices/addFeedSlice';
import allIngredientsReducer from '../slices/allIngredientsSlice';
import feedModalReducer from '../slices/feedModalSlice';
import registerReducer from '../slices/registerSlice';
import loginUserReducer from '../slices/loginUserSlice';
import profileReducer from '../slices/profileSlice';
import logoutReducer from '../slices/logoutSlice';
import orderReducer from '../slices/orderSlice';
import ordersProfileReducer from '../slices/ordersProfileSlice';
import isLoggedInReducer from '../slices/isLoggedInSlice';
import orderNumberReducer from '../slices/orderNumberSlice';
import profileModalReducer from '../slices/profileModalSlice';

describe('Redux Store', () => {
  it('Проверка на правильную инициализацию rootReducer', () => {
    const testStore = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
        ingredient_modal: ingredientModalReducer,
        add_ingredient: addIngredientReducer,
        add_feed: addFeedReducer,
        all_ingredients: allIngredientsReducer,
        feed_modal: feedModalReducer,
        login: loginUserReducer,
        register: registerReducer,
        profile: profileReducer,
        logout: logoutReducer,
        order: orderReducer,
        orders_profile: ordersProfileReducer,
        logged_in: isLoggedInReducer,
        order_number: orderNumberReducer,
        profile_modal: profileModalReducer
      },
      devTools: process.env.NODE_ENV !== 'production'
    });

    expect(testStore.getState().ingredients).toBeDefined();
    expect(testStore.getState().ingredient_modal).toBeDefined();
    expect(testStore.getState().add_ingredient).toBeDefined();
    expect(testStore.getState().add_feed).toBeDefined();
    expect(testStore.getState().all_ingredients).toBeDefined();
    expect(testStore.getState().feed_modal).toBeDefined();
    expect(testStore.getState().login).toBeDefined();
    expect(testStore.getState().register).toBeDefined();
    expect(testStore.getState().profile).toBeDefined();
    expect(testStore.getState().logout).toBeDefined();
    expect(testStore.getState().order).toBeDefined();
    expect(testStore.getState().orders_profile).toBeDefined();
    expect(testStore.getState().logged_in).toBeDefined();
    expect(testStore.getState().order_number).toBeDefined();
    expect(testStore.getState().profile_modal).toBeDefined();
  });

  it('Должны соответствовать начальному состоянию корневого редуктора', () => {
    const initialState: RootState = store.getState();

    expect(initialState.ingredients).toEqual(
      ingredientsReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.ingredient_modal).toEqual(
      ingredientModalReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.add_ingredient).toEqual(
      addIngredientReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.add_feed).toEqual(
      addFeedReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.all_ingredients).toEqual(
      allIngredientsReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.feed_modal).toEqual(
      feedModalReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.login).toEqual(
      loginUserReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.register).toEqual(
      registerReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.profile).toEqual(
      profileReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.logout).toEqual(
      logoutReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.order).toEqual(
      orderReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.orders_profile).toEqual(
      ordersProfileReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.logged_in).toEqual(
      isLoggedInReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.order_number).toEqual(
      orderNumberReducer(undefined, { type: '@@INIT' })
    );
    expect(initialState.profile_modal).toEqual(
      profileModalReducer(undefined, { type: '@@INIT' })
    );
  });
});
