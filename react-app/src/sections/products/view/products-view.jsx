import { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// import { products } from 'src/_mock/products';

import { searchMedia, getAllMedia } from 'src/apis/media';

import MediaSearch from '../media-search';
import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import ProductFilters from '../product-filters';
// ----------------------------------------------------------------------

export default function ProductsView() {
  const [openFilter, setOpenFilter] = useState(false);
  const [mediaItems, setMediaItems] = useState([]);

  useEffect(() => {
    fetchAllMedia();
  }, []);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleSearch = async (value) => {
    if (value && value.length > 3) {
      const searchTerm = value;
      const response = await searchMedia({ searchTerm });
      console.log(response.data.data);
      setMediaItems(response.data.data);
    } else if (!value) {
      fetchAllMedia();
    }
  };
  const fetchAllMedia = async () => {
    const response = await getAllMedia();
    setMediaItems(response.data.data);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
      </Typography>

      <Grid container spacing={2}>
        <Grid xs={3} md={3} textAlign="center">
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />
        </Grid>
        <Grid xs={6} md={6}>
          <MediaSearch onSearch={handleSearch} />
        </Grid>
        <Grid xs={3} md={3} textAlign="center">
          <ProductSort />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {mediaItems.map((media) => (
          <Grid key={media.id} xs={12} sm={6} md={3}>
            <ProductCard product={media} />
          </Grid>
        ))}
        {/* {products.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={3}>
            <ProductCard product={product} />
          </Grid>
        ))} */}
      </Grid>
    </Container>
  );
}