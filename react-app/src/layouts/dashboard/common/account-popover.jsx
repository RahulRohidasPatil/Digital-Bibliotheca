import { useState, useContext,Fragment } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
// import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useUser } from 'src/hooks/use-user';

import { themeContext } from 'src/theme';

// import { account } from 'src/_mock/account';
import { useRouter } from 'src/routes/hooks';
import { deleteCookie, hasCookie } from 'cookies-next';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    url: '',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    url: '/edit-profile',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    url: '',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();

  const { switchThemeMode } = useContext(themeContext)

  const [open, setOpen] = useState(null);

  const { user } = useUser();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMenuItemClick = (option) => () => {
    if (option.url !== '') {
      router.replace(option.url);
      setOpen(null);
    } else {
      setOpen(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
    if (hasCookie('token')) {
      deleteCookie('token');
    }
    setOpen(null);
  };
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
        }}
      >
        <Avatar
          alt={user?.FirstName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
            background: 'darkgrey',
          }}
        >
          {user?.FirstName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {`${user?.FirstName}  ${user?.FamilyName}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.EmailAddress}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={handleMenuItemClick(option)}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />
        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={switchThemeMode}
          sx={{ typography: 'body2', py: 1.5 }}
        >
          Change Theme
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}