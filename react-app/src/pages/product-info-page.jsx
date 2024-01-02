import { Box, Button, Card, Chip, Container, Grid, Rating, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { getByID } from 'src/apis/media';
import { useUser } from 'src/hooks/use-user';
import { purchaseMedia } from 'src/apis/purchase';

export default function ProductInfoPage() {
  const { id } = useParams();
  const [product, setproduct] = useState();
  const { user } = useUser();

  const [showPurchaseButton, setShowPurchasebutton] = useState(true);

  useEffect(() => {
    getByID(id).then((response) => setproduct(response.data.data[0]));
  }, [id]);

  const setContentTypeLabel = (type) => {
    switch (type) {
      case 1:
        return 'Image';
      case 2:
        return 'Video';
      case 3:
        return 'Audio';
      case 4:
        return 'Document';
      case 5:
        return 'Link';
      default:
        return 'Image';
    }
  };

  const setDeliveryMethodLabel = (deliveryMethod) =>
    deliveryMethod === '2' ? 'Contact' : 'Instant';

  const buyMedia = async () => {
    purchaseMedia({ customerId: user.Id, mediaId: id });
    setShowPurchasebutton(false);
  };

  return (
    <>
      <Helmet>
        <title>{product?.Title ?? 'Product Info'} | Minimal UI</title>
      </Helmet>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h4" sx={{ mb: 5 }}>
              {product?.Title}
            </Typography>
            <Card sx={{ width: 300, height: 300 }}>
              <Box sx={{ pt: '100%', position: 'relative' }}>
                {product?.status}

                <Box
                  component="img"
                  alt={product?.name}
                  src={
                    product && product.DemoFilePath
                      ? product.DemoFilePath
                      : '/assets/images/no-image.jpg'
                  }
                  sx={{
                    top: 0,
                    width: 1,
                    height: 1,
                    objectFit: 'cover',
                    position: 'absolute',
                  }}
                />
              </Box>
            </Card>
            <Typography sx={{ marginTop: 2 }} variant="caption" component="div">
              {product?.Description}
            </Typography>
            <Typography sx={{ marginTop: 2 }} variant="caption" component="div">
              {setContentTypeLabel(product?.MediaType)}
            </Typography>
            <Typography sx={{ marginTop: 2 }} variant="caption" component="div">
              Delivery: {setDeliveryMethodLabel(product?.DeliveyMethod)}
            </Typography>
            <div style={{ marginTop: 15 }}>
              <Chip label={`${product?.Price} €`} variant="outlined" sx={{ mr: 2 }} />
              <Chip label={product?.CreatedDate.split('T')[0]} variant="outlined" />
            </div>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ marginTop: 2, fontSize: 20 }} variant="caption" component="div">
              Reviews:
            </Typography>
            <Rating value={5} readOnly />
            <Box
              sx={{
                width: '400px', // Adjust width as needed
                height: '150px', // Adjust height as needed
                borderRadius: '10px', // Adjust border-radius for rounded corners
                backgroundColor: '#f0f0f0', // Placeholder color
                marginTop: '10px', // Adjust margin as needed
              }}
            />
            <Box
              sx={{
                width: '400px', // Adjust width as needed
                height: '150px', // Adjust height as needed
                borderRadius: '10px', // Adjust border-radius for rounded corners
                backgroundColor: '#f0f0f0', // Placeholder color
                marginTop: '10px', // Adjust margin as needed
              }}
            />
            <Button
              sx={{ marginTop: 1 }}
              variant="outlined"
              onClick={() => {
                console.log('Initiate chat with creator');
                window.location.replace(`/chats/${product.OwnerId}`);
              }}
            >
              Chat with Creator
            </Button>
            <Button
              sx={{ marginTop: 1, marginLeft: 2, display: showPurchaseButton ? '' : 'none' }}
              variant="outlined"
              onClick={buyMedia}
            >
              Purchase
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
