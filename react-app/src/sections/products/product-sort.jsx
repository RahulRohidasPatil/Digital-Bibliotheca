import { useEffect, useState } from 'react';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];

ShopProductSort.propTypes = {
  sortOption: PropTypes.object,
  setSortOption: PropTypes.func,
};

export default function ShopProductSort({ sortOption, setSortOption }) {
  const [open, setOpen] = useState(null);

  useEffect(() => setSortOption(SORT_OPTIONS[0]), [setSortOption]);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (optionValue) => {
    setOpen(null);
    setSortOption(SORT_OPTIONS.find(option => option.value === optionValue));
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {sortOption?.label}
        </Typography>
      </Button>

      <Menu
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              [`& .${listClasses.root}`]: {
                p: 0,
              },
            },
          },
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem key={option.value} selected={option.value === sortOption?.value} onClick={() => handleClose(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
