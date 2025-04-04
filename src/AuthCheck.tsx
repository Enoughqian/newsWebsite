import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = Cookies.get('userInfo');

    if (!userInfo) {
      console.log('用户未登录或Cookie已过期，跳转到登录页');
      navigate('/sign-in'); // 跳转到登录页
    }
  }, [navigate]);

  return null;
};

export default AuthCheck;
