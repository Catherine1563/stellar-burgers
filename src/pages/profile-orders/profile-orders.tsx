import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { fetchOrdersProfile } from '../../slices/ordersProfileSlice';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector((state) => state.orders_profile.orders);
  const isOrdersLoading = useSelector(
    (state) => state.orders_profile.isOrdersLoading
  );
  const dispatch = useDispatch();

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
