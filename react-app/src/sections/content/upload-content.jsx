import React, { useState, useEffect, useRef } from 'react';
import Alert from '@mui/material/Alert';
import { TextField, Button, Grid, Container } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import LoadingButton from '@mui/lab/LoadingButton';

import { addMedia } from 'src/apis/media';
// eslint-disable-next-line import/no-extraneous-dependencies
import watermark from 'watermarkjs';

import Iconify from 'src/components/iconify';

import SelectInputWithChip from './Select-Input';
import FileUploader from './file-uploader/FileUploader';

const mediaTypeNames = ['Image', 'Video', 'Audio', 'Document', 'Link'];

const deliveryMethods = ['Instant', 'Contact'];

const defaultFormData = {
  title: '',
  description: '',
  mediaType: 0,
  price: 0,
  deliveryMethod: 0,
  demoFile: [],
  uploadFiles: [],
};

const UploadContent = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [toUpload, setToUpload] = useState(false);
  const didMount = useRef(false);
  const [snackbar, showSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(false);
  const [snackBarSeverity, setSnackBarSeverity] = useState('success');
  const [successDialog, setSuccessDialog] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      // eslint-disable-next-line no-restricted-globals
      [name]: type === 'file' ? event.target.files : value,
    }));
  };

  const rotate = (target) => {
    const context = target.getContext('2d');
    const text = 'Fulda Hochschule Digital Bibliotheca';
    // const metrics = context.measureText(text);
    const x = target.width / 4;
    const y = target.height / 1.1;

    context.translate(x, y);
    context.globalAlpha = 0.8;
    context.fillStyle = '#fff';
    context.font = '52px Arial';
    context.rotate((-45 * Math.PI) / 180);
    context.fillText(text, 0, 0);
    return target;
  };

  const handleShowSnackbar = (text = '', severity = 'error', show = false) => {
    setSnackbarMessage(text);
    setSnackBarSeverity(severity);
    showSnackbar(show);
    setLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here

    if (formData.mediaType === 0) {
      handleShowSnackbar('Please Select Media Type', 'error', true);
    } else if (formData.deliveryMethod === 0) {
      handleShowSnackbar('Please Select Delivery Method', 'error', true);
    } else if (formData && formData.demoFile && formData.demoFile.length === 0) {
      handleShowSnackbar('Please Select a Demo File', 'error', true);
    } else if (formData && formData.uploadFiles && formData.uploadFiles.length === 0) {
      handleShowSnackbar('Please Select Files', 'error', true);
    }

    else {
      const img = formData.demoFile[0];
      await watermark([img])
        .blob(rotate)
        .then(async (waterMarkedImage) => {
          await setFormData({ ...formData, demoFile: [waterMarkedImage] });
        });
      uploadMedia();
    }
  };

  const uploadMedia = () => {
    setLoading(true);
    addMedia(formData)
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setSuccessDialog(true);
          resetForm();
          setToUpload(false);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log('Error Uploading Media -> ', error);
        setSnackbarMessage(error.response.data.message);
        setSnackBarSeverity('error');
        showSnackbar(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Return early, if this is the first render:
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (toUpload) {
      uploadMedia();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toUpload]);

  const resetForm = () => {
    setFormData(defaultFormData);
    setResetKey(resetKey + 1);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit} style={{}}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <div>
              <TextField
                key={resetKey}
                label="Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                margin="none"
                required
              />
            </div>

            <div>
              <TextField
                key={resetKey}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={4}
                fullWidth
                placeholder="Write description"
                margin="normal"
                required
              />
            </div>

            <div>
              {/*
              (Amar Sharma)
              Peer Review for Monoraul -  Handle negative input for price field 
              */}

              <TextField
                key={resetKey}
                label="Price"
                type="text"
                name="price"
                value={formData.price}
                placeholder="Enter Price"
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                inputProps={{ min: 0, inputMode: 'decimal', pattern: '^\\d+(\\.\\d{0,2})?$', }}
                required
              />
              {/** Peer Review Response by Monoraul - Negative input field for price is handled */}
            </div>
            <div
              style={{
                marginTop: '16px',
              }}
            >
              <SelectInputWithChip
                key={resetKey}
                formData={formData}
                setFormData={setFormData}
                label="Media Type"
                name="mediaType"
                items={mediaTypeNames}
              />
            </div>
            <div
              style={{
                marginTop: '16px',
              }}
            >
              <SelectInputWithChip
                key={resetKey}
                sx={{ marginTop: '10' }}
                formData={formData}
                setFormData={setFormData}
                label="DeliveryMethod"
                name="deliveryMethod"
                items={deliveryMethods}
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={6}>
            <div
              style={{
                marginBottom: '10px',
              }}
            >
              <FileUploader
                key={resetKey}
                label="Demo File *"
                formData={formData}
                setFormData={setFormData}
                name="demoFile"
                multiple={false}
                isDemo
              />
            </div>
            <div>
              <FileUploader
                key={resetKey}
                label="File *"
                name="uploadFiles"
                formData={formData}
                setFormData={setFormData}
              />
            </div>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          style={{
            display: 'grid',
            placeContent: 'center',
            marginTop: '16px',
          }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            style={{ marginTop: 16, padding: '10px 32px' }}
          >
            Submit
          </LoadingButton>
          {/* <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: 16, padding: '10px 32px' }}
          >
            Submit
          </Button> */}
        </Grid>
      </form>

      <Dialog
        open={successDialog}
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description"
        maxWidth="sm"
        disableEscapeKeyDown
      >
        <DialogTitle id="success-dialog-title">
          Upload Successful &nbsp;
          <Iconify icon="noto-v1:party-popper" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="success-dialog-description">
            Your Content has been uploaded and sent for Approval. Once Approved it will be visible
            to all the users. Do you want to upload something else?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="success" onClick={() => setSuccessDialog(false)}>
            Yes
          </Button>
          <Button autoFocus variant="outlined" color="primary" href="/my-uploads">
            That&apos;s it
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbar}
        autoHideDuration={5000}
        onClose={() => showSnackbar(false)}
        message={snackbarMessage}
      >
        <Alert
          onClose={() => showSnackbar(false)}
          severity={snackBarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UploadContent;
