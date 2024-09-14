import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { fetchOrdersProfile } from '../../slices/ordersProfileSlice';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const ordersProfile = useSelector(
    (state) => state.orders_profile.ordersProfile
  );
  const isOrdersLoading = useSelector(
    (state) => state.orders_profile.isOrdersLoading
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (ordersProfile.length === 0) {
      dispatch(fetchOrdersProfile());
    }
  }, [dispatch, ordersProfile.length]);

  if (isOrdersLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={ordersProfile} />;
};
