import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// import { products } from 'src/_mock/products';

import { searchMedia, getAllMedia } from 'src/apis/media';

import MediaSearch from '../media-search';
import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import ProductFilters, { SORT_OPTIONS } from '../product-filters';
// ----------------------------------------------------------------------

export default function ProductsView() {
  const [openFilter, setOpenFilter] = useState(false);
  const [mediaItems, setMediaItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);
  const [filters, setFilters] = useState({ mediaTypes: [] });
  const location = useLocation();

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const checkIfPreFilterPresent = useCallback(async () => {
    if (location && location.state && location.state.mediaType) {
      setFilters({ mediaTypes: [location.state.mediaType] });
      console.log(location.state);
    }
  }, [location]);
  const fetchAllMedia = useCallback(async () => {
    const response = await getAllMedia(sortOption.value, JSON.stringify(filters));
    if (response.data?.data) setMediaItems(response.data.data);
  }, [sortOption, filters]);

  const handleSearch = useCallback(async () => {
    if (searchTerm && searchTerm.length > 3) {
      const response = await searchMedia({ searchTerm, sortOption: sortOption.value, filters });
      if (response.data?.data) {
        setMediaItems(response.data.data);
      }
    } else if (!searchTerm) {
      fetchAllMedia();
    }
  }, [fetchAllMedia, filters, searchTerm, sortOption.value]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  useEffect(() => {
    checkIfPreFilterPresent();
  }, [checkIfPreFilterPresent]);
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
      </Typography>

      <Grid container spacing={2}>
        <Grid xs={12} md={3} textAlign="center">
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            setFilters={setFilters}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <MediaSearch setSearchTerm={setSearchTerm} />
        </Grid>
        <Grid xs={12} md={3} textAlign="center">
          <ProductSort sortOption={sortOption} setSortOption={setSortOption} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {mediaItems.map((media) => (
          <Grid key={`ProductCard_${media.Id}`} xs={6} sm={6} md={3}>
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
