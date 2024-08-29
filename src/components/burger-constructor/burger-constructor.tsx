import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/services/store';
import { resetIngredients } from '../../slices/addIngredientSlice';
import {
  fetchOrder,
  handleOrderClick,
  resetOrder
} from '../../slices/orderSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const { bun, arrIngredients } = useSelector(
    (state: RootState) => state.add_ingredient
  );
  const { orderModalData, orderRequest } = useSelector(
    (state: RootState) => state.order
  );
  const isRegisSuccess = useSelector(
    (state: RootState) => state.register.isRegisSuccess
  );
  const isAuthSuccess = useSelector(
    (state: RootState) => state.login.isAuthSuccess
  );
  const isLogout = useSelector((state: RootState) => state.logout.isLogout);
  const isAuthenticated = (isAuthSuccess || isRegisSuccess) && !isLogout;
  const dispatch = useDispatch<AppDispatch>();
  const constructorItems = {
    bun: bun,
    ingredients: arrIngredients
  };

  const onOrderClick = () => {
    if (isAuthenticated) {
      if (constructorItems.bun && constructorItems.ingredients.length > 0) {
        const ingredientsIds = [
          constructorItems.bun ? constructorItems.bun._id : null,
          ...constructorItems.ingredients.map((ingredient) => ingredient._id),
          constructorItems.bun ? constructorItems.bun._id : null
        ].filter((id) => id !== null);

        if (ingredientsIds.length > 1 && !orderRequest) {
          dispatch(handleOrderClick());
          dispatch(fetchOrder(ingredientsIds));
        }
      }
    }
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
    dispatch(resetIngredients());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce<number>((s, v) => s + v.price, 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
