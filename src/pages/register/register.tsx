import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { TRegisterData } from '@api';
import { fetchRegisterUser } from '../../slices/registerSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { checkTokens } from '../../slices/isLoggedInSlice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const success = useSelector((state) => state.register.success);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (userName !== '' || email !== '' || password !== '') {
      const userData: TRegisterData = {
        email: email,
        name: userName,
        password: password
      };
      dispatch(fetchRegisterUser(userData));
    }
  };
  useEffect(() => {
    if (success) {
      dispatch(checkTokens());
      navigate('/');
    }
  }, [success, navigate]);

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
