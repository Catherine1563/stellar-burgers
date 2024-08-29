import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { fetchOrdersProfile } from '../../slices/ordersProfileSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector((state: RootState) => state.orders_profile.orders);
  const isOrdersLoading = useSelector(
    (state: RootState) => state.orders_profile.isOrdersLoading
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchOrdersProfile());
    }
  }, [dispatch, orders.length]);

  if (isOrdersLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
