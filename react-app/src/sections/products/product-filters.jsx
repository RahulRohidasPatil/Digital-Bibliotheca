import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
// import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
// import { ColorPicker } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];
export const MEDIA_TYPE_OPTIONS = [
  { value: 0, label: 'Audio' },
  { value: 1, label: 'Video' },
  { value: 2, label: 'Image' },
  { value: 3, label: 'Document' }
];
export const UPLOADED_OPTIONS = [
  { value: 0, label: '1 Week Ago' },
  { value: 1, label: '1 Month Ago' },
  { value: 2, label: '6 Months Ago' },
  { value: 3, label: '1 Year Ago' }
];
export const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const PRICE_OPTIONS = [
  { value: 'below', label: 'Below €25' },
  { value: 'between', label: 'Between €25 - €75' },
  { value: 'above', label: 'Above €75' },
];
export const COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

// ----------------------------------------------------------------------

export default function ProductFilters({ openFilter, onOpenFilter, onCloseFilter, setFilters }) {
  const [mediaTypes, setMediaTypes] = useState([]);
  const [price, setPrice] = useState(null);
  const [uploaded, setUploaded] = useState(null);

  function handleMediaTypeChange(checked, value) {
    if (checked) setMediaTypes([...mediaTypes, value]);
    else setMediaTypes(mediaTypes.filter(item => item !== value));
  };

  function clearAll(){
    setMediaTypes([]);
    setPrice(null);
    setUploaded(null);
    onCloseFilter();
  }

  useEffect(() => {
    setFilters({ mediaTypes, price, uploaded });
  }, [mediaTypes, price, setFilters, uploaded]);

  const renderMediaTypes = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Media Type</Typography>
      <FormGroup>
        {MEDIA_TYPE_OPTIONS.map(({ value, label }) => (
          <FormControlLabel
            key={value}
            control={<Checkbox
              onChange={(event) => handleMediaTypeChange(event.target.checked, value)}
              checked={mediaTypes.includes(value)}
            />}
            label={label} />
        ))}
      </FormGroup>
    </Stack>
  );

  const renderCategory = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Uploaded</Typography>
      <RadioGroup>
        {UPLOADED_OPTIONS.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={<Radio
              onChange={() => setUploaded(item.value)}
              checked={uploaded === item.value}
            />}
            label={item.label} />
        ))}
      </RadioGroup>
    </Stack>
  );

  // const renderColors = (
  //   <Stack spacing={1}>
  //     <Typography variant="subtitle2">Colors</Typography>
  //     <ColorPicker
  //       name="colors"
  //       selected={[]}
  //       colors={COLOR_OPTIONS}
  //       onSelectColor={(color) => [].includes(color)}
  //       sx={{ maxWidth: 38 * 4 }}
  //     />
  //   </Stack>
  // );

  const renderPrice = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Price</Typography>
      <RadioGroup>
        {PRICE_OPTIONS.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={<Radio
              onChange={(event) => setPrice(event.target.value)}
              checked={price === item.value}
            />}
            label={item.label}
          />
        ))}
      </RadioGroup>
    </Stack>
  );

  // const renderRating = (
  //   <Stack spacing={1}>
  //     <Typography variant="subtitle2">Rating</Typography>
  //     <RadioGroup>
  //       {RATING_OPTIONS.map((item, index) => (
  //         <FormControlLabel
  //           key={item}
  //           value={item}
  //           control={
  //             <Radio
  //               disableRipple
  //               color="default"
  //               icon={<Rating readOnly value={4 - index} />}
  //               checkedIcon={<Rating readOnly value={4 - index} />}
  //               sx={{
  //                 '&:hover': { bgcolor: 'transparent' },
  //               }}
  //             />
  //           }
  //           label="& Up"
  //           sx={{
  //             my: 0.5,
  //             borderRadius: 1,
  //             '&:hover': { opacity: 0.48 },
  //           }}
  //         />
  //       ))}
  //     </RadioGroup>
  //   </Stack>
  // );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={onOpenFilter}
      >
        Filters&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="h6" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {renderMediaTypes}

            {renderCategory}

            {/* {renderColors} */}

            {renderPrice}

            {/* {renderRating} */}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
            onClick={() => clearAll()}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

ProductFilters.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  setFilters: PropTypes.func
};
