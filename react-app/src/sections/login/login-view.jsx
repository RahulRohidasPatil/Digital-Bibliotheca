import { useEffect, useState } from 'react';

import { setCookie } from 'cookies-next';
import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import { useForm } from 'react-hook-form';

// import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { loginUser } from 'src/apis/auth';

import { useUser } from 'src/hooks/use-user';
import { Toolbar } from '@mui/material';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [snackbar, showSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(false);
  const { setUser, user } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn && Boolean(isLoggedIn) && user) {
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values) => {
    const resp = await loginUser({
      emailAddress: values.emailAddress,
      password: values.password,
    }).catch((err) => {
      console.log(err);
      setSnackbarMessage(err.response.data.message);
      showSnackbar(true);
    });

    if (resp && resp.status === 200) {
      const userValue = resp.data.data;
      setCookie('token', `Bearer ${resp.data.token}`);
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('user', JSON.stringify(userValue));
      setUser(userValue);
      router.replace('/');
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3} sx={{ my: 2 }}>
        <form id="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            sx={{ mt: 2 }}
            type="email"
            fullWidth
            {...register('emailAddress', {
              required: true,
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[\w-]+\.hs-fulda\.de$/i,
                message: 'Please enter a valid email',
              },
            })}
            placeholder="example@department.hs-fulda.de"
            label="Email"
            required
            className="input"
          />
          {errors.emailAddress && (
            <Typography variant="body2" color="red">
              {errors.emailAddress.message}
            </Typography>
          )}
          <TextField
            sx={{ my: 2 }}
            fullWidth
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...register('password', { required: true })}
            placeholder="password"
            label="Password"
          />
          {errors.password && (
            <Typography variant="body2" color="red">
              Password is required
            </Typography>
          )}{' '}
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="inherit"
            onClick={handleSubmit(onSubmit)}
          >
            Login
          </LoadingButton>
        </form>
      </Stack>

      {/* <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack> */}
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      {/* <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      /> */}
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          position: 'fixed',
          top: { xs: 0, md: 0 },
          color: 'white',
          backgroundColor: 'green',
        }}
      >
        <span>
          Fulda University of Applied Sciences Software Engineering Project, Fall 2023 For
          Demonstration Only
        </span>
      </Toolbar>

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Login | FHDB</Typography>

          {renderForm}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider>
          <Typography variant="body2" sx={{ mt: 2, justifyContent: 'center', display: 'flex' }}>
            Don’t have an account?
            <Button
              size="small"
              variant="contained"
              color="inherit"
              href="/register"
              sx={{ ml: 2 }}
            >
              Register
            </Button>
          </Typography>
        </Card>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbar}
        autoHideDuration={2000}
        onClose={() => showSnackbar(false)}
        message={snackbarMessage}
      >
        <Alert onClose={() => showSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
