import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { fetchFeed } from '../../slices/addFeedSlice';
import { TOrder } from '@utils-types';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector((state: RootState) => state.add_feed.orders);
  const isOrdersLoading = useSelector(
    (state: RootState) => state.add_feed.isOrdersLoading
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchFeed());
    }
  }, [dispatch, orders.length]);

  if (isOrdersLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeed());
      }}
    />
  );
};
