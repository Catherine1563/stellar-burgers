import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { TLoginData } from '@api';
import { featchloginUser } from '../../slices/loginUserSlice';
import { useDispatch, useSelector } from '../../services/store';
import { checkTokens } from '../../slices/isLoggedInSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const success = useSelector((state) => state.login.success);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (email !== '' || password !== '') {
      const userData: TLoginData = {
        email: email,
        password: password
      };
      dispatch(featchloginUser(userData));
    }
  };

  useEffect(() => {
    if (success) {
      dispatch(checkTokens());
      navigate('/');
    }
  }, [success, navigate]);

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
