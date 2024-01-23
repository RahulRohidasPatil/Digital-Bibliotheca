import { Avatar, Box, Button, Card, Chip, Container, Divider, Grid, Paper, Rating, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useUser } from 'src/hooks/use-user';
import { purchaseMedia } from 'src/apis/purchase';
import { isOwner, hasPurchased, getByID, addComment } from 'src/apis/media';
import { useRouter } from 'src/routes/hooks';
import { LoadingButton } from '@mui/lab';

export default function ProductInfoPage() {
  const { id } = useParams();
  const [product, setproduct] = useState();
  const { user } = useUser();

  const [showPurchaseButton, setShowPurchasebutton] = useState(true);
  const [showDiscussionButton, setShowDiscussionButton] = useState(false);
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    getByID(id).then((response) => setproduct(response.data.data[0]));

    const shouldShowPurchaseButton = async () => {
      const owner = await isOwner(id, user.Id);
      const purchased = await hasPurchased(id, user.Id);
      setShowPurchasebutton(!(owner.data.data || purchased.data.data));
      setShowDiscussionButton(!showPurchaseButton);
    }

    shouldShowPurchaseButton();

  }, [id, user.Id, showPurchaseButton]);

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
    setShowDiscussionButton(true);
  };

  const joinChat =() => {
    router.replace(`/discussion/${product.Id}`);
  }

  function onAddComment(e) {
    e.preventDefault()
    setLoading(true)
    addComment({ customerId: user.Id, mediaId: id, comment })
    getByID(id).then((response) => setproduct(response.data.data[0]));
    setLoading(false)
  }

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
            <Box my={3} p={3} component={Paper} elevation={3}>
              <Typography variant="h5" gutterBottom>
                Comments
              </Typography>
              {product?.comments.map((commentObj) => (
                <Box key={commentObj.Id} mb={3}>
                  <Box display="flex" alignItems="center">
                    <Avatar src={comment.avatar} alt={comment.user} />
                    <Box ml={2}>
                      <Typography variant="subtitle1">{commentObj.CustomerId}</Typography>
                      <Typography variant="body1">{commentObj.CommentText}</Typography>
                    </Box>
                  </Box>
                  <Box mt={2}>
                    <Typography>{comment.comment}</Typography>
                  </Box>
                  <Divider mt={2} />
                </Box>
              ))}
            </Box>
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
            {showPurchaseButton ? <Button
              sx={{ marginTop: 1, marginLeft: 2}}
              variant="outlined"
              onClick={buyMedia}
            >
              Purchase
            </Button> :
            null}
            {showDiscussionButton ? <Button
              sx={{ marginTop: 1, marginLeft: 2}}
              variant="outlined"
              onClick={joinChat}
            >
              Discussion
            </Button> :
            null}
            {showDiscussionButton && <form onSubmit={onAddComment}>
              <TextField
                label="Write Your Comment"
                type="text"
                value={comment}
                onChange={e => setComment(e.target.value)}
                fullWidth
                margin="normal"
              />
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
                style={{ padding: '10px 32px' }}
              >
                Submit
              </LoadingButton>
            </form>}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
