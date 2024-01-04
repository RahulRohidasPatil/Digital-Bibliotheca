import React, { useState, useEffect, useRef } from 'react';

import { TextField, Button, Grid, Container } from '@mui/material';

import { addMedia } from 'src/apis/media';
// eslint-disable-next-line import/no-extraneous-dependencies
import watermark from 'watermarkjs';

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

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? e.target.files : value,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here

    if (formData && formData.demoFile && formData.demoFile.length) {
      const img = formData.demoFile[0];
      await watermark([img])
        .blob(rotate)
        .then(async (waterMarkedImage) => {
          await setFormData({ ...formData, demoFile: [waterMarkedImage] });
          await setToUpload(true);
        });
    }
  };

  const uploadMedia = () => {
    addMedia(formData).then((value) => {
      console.log(value);
      resetForm();
      setToUpload(false);
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
    // setFormData(defaultFormData);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit} style={{}}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <div>
              <TextField
                label="Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                margin="none"
              />
            </div>

            <div>
              <TextField
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
              />
            </div>

            <div>
              <TextField
                label="Price"
                type="number"
                name="price"
                value={formData.price}
                placeholder="Enter Price"
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </div>
            <div
              style={{
                marginTop: '16px',
              }}
            >
              <SelectInputWithChip
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
                label="Demo File (optional)"
                formData={formData}
                setFormData={setFormData}
                name="demoFile"
                multiple={false}
              />
            </div>
            <div>
              <FileUploader
                label="File"
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: 16, padding: '10px 32px' }}
          >
            Submit
          </Button>
        </Grid>
      </form>
    </Container>
  );
};

export default UploadContent;
