import { FC } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../services/store';
import { featchLogout, resetLogoutState } from '../../slices/logoutSlice';
import { resetLoginState } from '../../slices/loginUserSlice';
import { resetRegisState } from '../../slices/registerSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(featchLogout()).then((result) => {
      if (featchLogout.fulfilled.match(result)) {
        dispatch(resetLoginState());
        dispatch(resetRegisState());
        dispatch(resetLogoutState());
        localStorage.removeItem('isAuthenticated');
        navigate('/');
      }
    });
  };
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
