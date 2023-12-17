import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function ShopProductCard({ product }) {
  const renderStatus = (
    <Label
      variant="filled"
      color={(product.status === 'sale' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {product.status}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={product.Title}
      src={product.FilePath}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {product.SalePrice && `€${product.SalePrice}`}
      </Typography>
      &nbsp;
      {`€${product.Price}`}
    </Typography>
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {product.status && renderStatus}

        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link
          href={`/product/${product.Id}`}
          color="inherit"
          underline="hover"
          variant="subtitle2"
          noWrap
        >
          {product.Title}
        </Link>
        <Typography sx={{ margin: '0 !important' }} variant="caption">
          {product.Description}
        </Typography>
        <Stack
          direction="row"
          sx={{ margin: '0 !important' }}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* <ColorPreview colors={product.colors} /> */}
          {renderPrice}
        </Stack>
      </Stack>
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.object,
};
