import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import PropTypes from 'prop-types';

import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------
MediaSearch.propTypes = {
  onSearch: PropTypes.func,
};

export default function MediaSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(searchTerm);
      onSearch(searchTerm);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <TextField
      fullWidth
      placeholder="Search post..."
      onChange={(e) => setSearchTerm(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ ml: 1, height: 20, color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
    />
  );
}
