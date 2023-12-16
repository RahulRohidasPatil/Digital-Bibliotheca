import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import PropTypes from 'prop-types';

import { useState } from 'react';

// ----------------------------------------------------------------------
MediaSearch.propTypes = {
  setSearchTerm: PropTypes.func,
};

export default function MediaSearch({ setSearchTerm }) {
  const [timeoutId, setTimeoutId] = useState();

  function onSearch(value){
    if (timeoutId) clearTimeout(timeoutId);

    const newTimeoutId = setTimeout(() => {
      console.log(value);
      setSearchTerm(value);
    }, 1000);
    setTimeoutId(newTimeoutId);
  }

  return (
    <TextField
      fullWidth
      placeholder="Search post..."
      onChange={(e) => onSearch(e.target.value)}
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
