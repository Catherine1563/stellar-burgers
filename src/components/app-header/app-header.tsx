import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector((state) => state.profile.user);
  const isLoggedIn = useSelector((state) => state.logged_in.isLoggedIn);

  if (isLoggedIn) {
    return <AppHeaderUI userName={user.name} />;
  } else {
    return <AppHeaderUI userName='' />;
  }
};
