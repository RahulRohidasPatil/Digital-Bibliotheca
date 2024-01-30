import { Avatar, Box, Button, Card, Chip, Container, Divider, Grid, Paper, Rating, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useUser } from 'src/hooks/use-user';
import { purchaseMedia } from 'src/apis/purchase';

import { isOwner, hasPurchased, getByID, reportMedia, addComment } from 'src/apis/media';
import { useRouter } from 'src/routes/hooks';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Iconify from 'src/components/iconify';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { LoadingButton } from '@mui/lab';

export default function ProductInfoPage() {
  const { id } = useParams();
  const [product, setproduct] = useState();
  const { user } = useUser();

  const [showPurchaseButton, setShowPurchasebutton] = useState(true);
  const [showDiscussionButton, setShowDiscussionButton] = useState(false);
  const [showReportMediaDialog, setShowReportMediaDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("")
  const [starRating, setStarRating] = useState(0)

  const [reportReasoon, setReportReason] = useState('');
  const router = useRouter();

  useEffect(() => {
    getByID(id).then((response) => setproduct(response.data.data[0]));

    const shouldShowPurchaseButton = async () => {
      const owner = await isOwner(id, user.Id);
      const purchased = await hasPurchased(id, user.Id);
      setShowPurchasebutton(!(owner.data.data || purchased.data.data));
      setShowDiscussionButton(!showPurchaseButton);
    };

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

  const joinChat = () => {
    router.replace(`/discussion/${product.Id}`);
  };

  const confirmReportMedia = async () => {
    setLoading(true);
    try {
      const response = await reportMedia(product.Id, user.Id, reportReasoon);
      if (response && response.status === 200) {
        setLoading(false);
        setShowReportMediaDialog(false);
        router.replace(`/`);
      }
    } catch (e) {
      console.log(e);
    }
    // ({ customerId: user.Id, mediaId: id });
    // setShowPurchasebutton(false);
  };

  const handleReportMedia = () => {
    setShowReportMediaDialog(true);
  };

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
            {showPurchaseButton ? (
              <Button sx={{ marginTop: 1, marginLeft: 2 }} variant="outlined" onClick={buyMedia}>
                Purchase
              </Button>
            ) : null}
            {showDiscussionButton ? (
              <Button sx={{ marginTop: 1, marginLeft: 2 }} variant="outlined" onClick={joinChat}>
                Discussion
              </Button>
            ) : null}

            <Button
              sx={{ marginTop: 1, marginLeft: 2 }}
              color="error"
              variant="outlined"
              onClick={handleReportMedia}
            >
              Report Media
            </Button>
            {showDiscussionButton && <form onSubmit={onAddComment}>
              <Rating
                name="star-rating"
                value={starRating}
                onChange={(_event, newValue) => {
                  setStarRating(newValue);
                }}
                sx={{ mt: 4 }}
              />
              <TextField
                label="Write Your Comment"
                type="text"
                value={comment}
                onChange={e => setComment(e.target.value)}
                fullWidth
                margin="dense"
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
        <Dialog
          open={showReportMediaDialog}
          aria-labelledby="success-dialog-title"
          aria-describedby="success-dialog-description"
          disableEscapeKeyDown
          maxWidth="lg"
        >
          <DialogTitle>
            Report Media &nbsp;
            <Iconify icon="ri:alert-fill" />
            <p style={{ fontSize: 16, fontWeight: 'lighter' }}>
              {' '}
              Once you report the media we will hide it for you.
            </p>
          </DialogTitle>

          <DialogContent>
            <FormControl style={{ marginTop: 10 }} fullWidth>
              <InputLabel id="report-reason">Reason for Reporting the Media</InputLabel>
              <Select
                labelId="report-reason"
                id="report-reason-select"
                value={reportReasoon}
                label="Reason for Reporting the Media"
                onChange={(e) => setReportReason(e.target.value)}
              >
                <MenuItem value="Inappropriate Content">Inappropriate Content</MenuItem>
                <MenuItem value="Harassment or Bullying">Harassment or Bullying</MenuItem>
                <MenuItem value="Fake or Misinformation">Fake or Misinformation</MenuItem>
                <MenuItem value="Intellectual Property Violation">
                  Intellectual Property Violation
                </MenuItem>
                <MenuItem value="Privacy Violation">Privacy Violation</MenuItem>
                <MenuItem value="Spam or Scam">Spam or Scam</MenuItem>
                <MenuItem value="Impersonation">Impersonation</MenuItem>
                <MenuItem value="Violent or Dangerous Behavior">
                  Violent or Dangerous Behavior
                </MenuItem>
                <MenuItem value="Drug or Substance Abuse">Drug or Substance Abuse</MenuItem>
                <MenuItem value="Graphic Images or Disturbing Content">
                  Graphic Images or Disturbing Content
                </MenuItem>
                <MenuItem value="Technical Issues">Technical Issues</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={loading}
              color="error"
              variant="outlined"
              disabled={reportReasoon === ''}
              onClick={confirmReportMedia}
            >
              Report Media
            </LoadingButton>
            <Button
              color="primary"
              disabled={loading}
              onClick={() => setShowReportMediaDialog(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
