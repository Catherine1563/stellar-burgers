import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { featchLogout } from '../../slices/logoutSlice';
import { resetLoginState } from '../../slices/loginUserSlice';
import { resetRegisState } from '../../slices/registerSlice';
import { useDispatch } from '../../services/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(featchLogout()).then((result) => {
      if (featchLogout.fulfilled.match(result)) {
        dispatch(resetLoginState());
        dispatch(resetRegisState());
        navigate('/');
      }
    });
  };
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
