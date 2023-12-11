import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';

import { alpha, useTheme } from '@mui/material/styles';
// import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import { useForm } from 'react-hook-form';

import Logo from 'src/components/logo';
// import Iconify from 'src/components/iconify';
import { registerUser } from 'src/apis/auth';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const theme = useTheme();

  const router = useRouter();

  const [snackbar, showSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn && Boolean(isLoggedIn)) {
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const onSubmit = async (values) => {
    const resp = await registerUser({
      firstName: values.firstName,
      lastName: values.lastName,
      age: values.age,
      emailAddress: values.emailAddress,
      password: values.password,
      phone: values.phone,
      role: 1,
    }).catch((err) => {
      console.log(err);
      setSnackbarMessage(err.response.data.message);
      showSnackbar(true);
    });

    if (resp && resp.status === 200) {
      localStorage.setItem('isLoggedIn', true);
      router.replace('/');
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3} sx={{ my: 2 }}>
        <form id="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            {...register('firstName', { required: true })}
            placeholder="First Name"
            label="First Name"
          />
          {errors.firstName && (
            <Typography variant="body2" color="red">
              First name is required
            </Typography>
          )}
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            {...register('lastName', { required: true })}
            placeholder="Last Name"
            label="Last Name"
          />
          {errors.lastName && (
            <Typography variant="body2" color="red">
              Last name is required
            </Typography>
          )}
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            {...register('age', { required: true })}
            placeholder="Age"
            label="Age"
          />
          {errors.age && (
            <Typography variant="body2" color="red">
              Age is required
            </Typography>
          )}
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
            sx={{ mt: 2 }}
            fullWidth
            type="password"
            {...register('password', { required: true })}
            placeholder="Password"
            label="Password"
          />
          {errors.password && (
            <Typography variant="body2" color="red">
              Password is required
            </Typography>
          )}
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            type="password"
            {...register('confirmPassword', { required: true,
            validate: (val) => val === watch('password')})}
            placeholder="Confirm Password"
            label="ConfirmPassword"
          />
          {errors.confirmPassword && (
            <Typography variant="body2" color="red">
              Passwords do not match.
            </Typography>
          )}
          <TextField
            type="number"
            sx={{ my: 2 }}
            fullWidth
            {...register('phone', { required: false })}
            placeholder="Phone"
            label="Phone"
          />
          {errors.phone && (
            <Typography variant="body2" color="red">
              Enter a valid phone number
            </Typography>
          )}

          {/* <input
              type="number"
              {...register("role", { required: false })}
              placeholder="role"
              min="1" max="2"
            />
            {errors.role && <span>role is required</span>} */}
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="inherit"
            onClick={handleSubmit(onSubmit)}
          >
            Register
          </LoadingButton>
        </form>
        {/* <Form>
          <TextField name="email" label="Email address" />

          <TextField
            name="password"
            label="Password"
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
          />
        </Form> */}
      </Stack>
      {/* 
      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
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
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Register | FHDB</Typography>

          {renderForm}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider>
          <Typography variant="body2" sx={{ mt: 2, justifyContent: 'center', display: 'flex' }}>
            Have an account?
            <Button size="small" variant="contained" color="inherit" href="/login" sx={{ ml: 2 }}>
              Login
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
