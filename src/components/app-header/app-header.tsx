import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector((state: RootState) => state.profile.user);
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  if (isAuthenticated) {
    return <AppHeaderUI userName={user.name} />;
  } else {
    return <AppHeaderUI userName='' />;
  }
};
