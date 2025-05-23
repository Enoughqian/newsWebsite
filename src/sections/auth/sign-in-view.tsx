import Cookies from 'js-cookie';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { login } from 'src/api/NewsService';
import { useToast } from 'src/ToastContext';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const [formData, setFormData] = useState<{ username: string, password: string }>({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignIn = useCallback(async () => {
    const response = await login({ ...formData })
    if (response.result.state === "Success") {
      const userData = {
        username: formData.username,
        role: response.result.permission
      }
      Cookies.set('userInfo', JSON.stringify(userData), { expires: 12, path: '/' });

      showToast(response.msg, 'success')
      router.push('/');
    } else {
      showToast(response.msg, 'error')
    }
  }, [formData, router, showToast]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="username"
        label="用户名"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        onChange={handleChange}
      />

      {/* <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link> */}

      <TextField
        fullWidth
        name="password"
        label="密码"
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        登录
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">用户登录</Typography>
      </Box>

      {renderForm}
    </>
  );
}
