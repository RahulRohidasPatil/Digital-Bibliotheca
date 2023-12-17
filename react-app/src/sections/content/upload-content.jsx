import React, { useState } from 'react';
import { TextField, Button, Grid, Container } from '@mui/material';
import { addMedia } from 'src/apis/media';
import SelectInputWithChip from './Select-Input';
import FileUploader from './file-uploader/FileUploader';

const mediaTypeNames = ['Image', 'Video', 'Audio', 'Document', 'Link'];

const deliveryMethods = ['Instant', 'Contact'];

const UploadContent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 0,
    price: 0,
    deliveryMethod: 0,
    demoFile: [],
    uploadFiles: [],
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? e.target.files : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    addMedia(formData).then((value) => e.target.reset());
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
