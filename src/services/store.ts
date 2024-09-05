import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
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

const rootReducer = {
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
  order_number: orderNumberReducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
