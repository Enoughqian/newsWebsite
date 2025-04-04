import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [user, setUser] = useState<{ username: string; role: string }>({
    username: '',
    role: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    // 尝试从 Cookie 获取用户信息
    const userInfo = Cookies.get('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  // 退出登录
  const logout = () => {
    Cookies.remove('userInfo'); // 删除 Cookie
    setUser({
      username: '',
      role: '',
    });
    navigate('/sign-in'); // 跳转到登录页
  };

  return {
    user, // 用户信息
    isAuthenticated: !!user, // 是否已登录
    logout, // 退出方法
  };
}
