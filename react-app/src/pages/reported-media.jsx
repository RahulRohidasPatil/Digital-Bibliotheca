import { Alert, Button, Container, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getReportedMedia, reviewReportedMedia } from 'src/apis/admin';
import { useUser } from 'src/hooks/use-user';
import { useRouter } from 'src/routes/hooks';
import Grid from '@mui/material/Unstable_Grid2';
import ProductCard from 'src/sections/products/product-card';
import Iconify from 'src/components/iconify';

export default function ReportedMediaPage() {
  const [reportedMedia, setReportedMedia] = useState([]);

  const { user } = useUser();

  const router = useRouter();

  useEffect(() => {
    fetchReportedMedia();
  }, [user, router]);

  const fetchReportedMedia = async () => {
    const response = await getReportedMedia();
    setReportedMedia(response.data);
  };
  const handleReviewAction = async (item, review) => {
    const body = {
      review,
      MediaId: item.MediaID,
    };
    await reviewReportedMedia(body);
    fetchReportedMedia();
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title>Manage Reported Media</title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Manage Reported Media
        </Typography>
        <Grid container spacing={3}>
          {reportedMedia.map((media) => (
            <Grid key={`ProductCard_${media.Id}`} xs={6} sm={6} md={3}>
              <Alert severity="warning">
                <Typography variant="body2">{media.ReasonOfReporting}</Typography>
                <Tooltip title="Deny Report">
                  <Button color="error" onClick={() => handleReviewAction(media, 0)}>
                    <Iconify icon="mdi-cancel" />
                  </Button>
                </Tooltip>
                <Tooltip title="Accept Report">
                  <Button color="success" onClick={() => handleReviewAction(media, 1)}>
                    <Iconify icon="mdi:tick" />
                  </Button>
                </Tooltip>
              </Alert>
              <ProductCard product={media} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
