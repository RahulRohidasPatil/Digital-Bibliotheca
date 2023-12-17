import PropTypes from 'prop-types';

// import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { getMediaByType } from 'src/apis/dashboard';
import { useEffect, useState } from 'react';
import { Button, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import ProductCard from '../products/product-card';
// ----------------------------------------------------------------------

const StyledGrid = styled(Grid)(() => ({
  '&::-webkit-scrollbar': {
    height: '5px',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    borderRadius: 10,
    height: '5px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    borderRadius: 10,
    height: '5px',
  },
}));

export default function AppGridProducts({ title, subheader, mediaType, ...other }) {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    handleGetMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetMedia = async () => {
    try {
      const response = await getMediaByType(mediaType);
      if (response && response.data && response.data.data && response.data.data.length) {
        setMedia(response.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} action={<Button>See More</Button>} />
      <CardContent>
        <StyledGrid
          id="DashboardMediaTypeList"
          container
          spacing={3}
          maxHeight={500}
          sx={{ width: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}
        >
          {media.map((mediaProduct) => (
            <Grid key={`${mediaType}ProductCard_${mediaProduct.Id}`} xs={6} sm={6} md={3}>
              <ProductCard product={mediaProduct} />
            </Grid>
          ))}
        </StyledGrid>
      </CardContent>
      {/* <Box sx={{ p: 3, pb: 1 }}></Box> */}
    </Card>
  );
}

AppGridProducts.propTypes = {
  subheader: PropTypes.string,
  title: PropTypes.string,
  mediaType: PropTypes.number,
};
