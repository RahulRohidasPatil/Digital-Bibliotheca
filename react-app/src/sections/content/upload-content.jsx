import React, { useState } from 'react';
import { TextField, Button, Grid, Box } from '@mui/material';
import { addMedia } from 'src/apis/media';
import SelectInputWithChip from './Select-Input';
import FileUploader from './file-uploader/FileUploader';

const UploadContent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: [],
    price: 0,
    demoFile: null,
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
    console.log('Form data submitted:', formData);
    addMedia(formData).then(value => console.log(29, value));
  };

  return (
    <Box
      sx={{
        padding: { xs: '0px 16px', sm: '0px 14px', lg: '0px 8px' },
      }}
    >
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
              <SelectInputWithChip />
            </div>
          </Grid>

          <Grid item xs={12} sm={6}>
            <div
              style={{
                marginBottom: '10px',
              }}
            >
              <FileUploader label="Demo File (optional)" name="demo" />
            </div>
            <div>
              <FileUploader label="File" name="File" />
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
    </Box>
  );
};

export default UploadContent;
