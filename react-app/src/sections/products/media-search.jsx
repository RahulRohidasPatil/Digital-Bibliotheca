import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------
MediaSearch.propTypes = {
  onSearch: PropTypes.func,
};

export default function MediaSearch({ onSearch }) {
  return (
    <TextField
      fullWidth
      placeholder="Search post..."
      onChange={(event) => onSearch(event.target.value)}
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
