import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Chip } from '@mui/material';

import PropTypes from 'prop-types';
// import './file-uploader.css';

FileUploader.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  multiple: PropTypes.bool,
  formData: PropTypes.object,
  setFormData: PropTypes.func,
  isDemo: PropTypes.bool,
};

function FileUploader({ label, name, multiple = true, formData, setFormData, isDemo = false }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [acceptValue, setAcceptValue] = useState('*')

  useEffect(()=>{
    if(!isDemo){
      setUploadedFiles([])
      switch (formData.mediaType) {
        case 1:
          setAcceptValue('image/*');
          break;
        case 2:
          setAcceptValue('video/*');
          break;
        case 3:
          setAcceptValue('audio/*');
          break;
        case 4:
          // You might want to specify document file types (e.g., application/pdf, application/msword)
          setAcceptValue('application/pdf, application/msword');
          break;
        case 5:
          // You might not need to specify an accept attribute for a link
          setAcceptValue('');
          break;
        default:
          // Default case, if mediaType does not match any of the above cases
          setAcceptValue('*');
          break;
      }
    }
    else{
      setAcceptValue('image/*');
    }
  }, [formData.mediaType, setAcceptValue, isDemo])

  const handleFileChange = (event) => {
    event.preventDefault()
    const { files } = event.target; // Destructuring assignment
    handleFiles(files);
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const { files } = event.dataTransfer; // Destructuring assignment
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const updatedFiles = multiple ? [...uploadedFiles] : [];
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      updatedFiles.push(file);
    }
    setUploadedFiles(updatedFiles);
    const formDataValue = [...updatedFiles];
    setFormData({ ...formData, [name]: formDataValue });
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
    const formDataValue = [...updatedFiles];
    setFormData({ ...formData, [name]: formDataValue });
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };
  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
        style={{
          marginBottom: '8px',
        }}
      >
        {label}
      </Typography>
      <Paper
        elevation={3}
        sx={{
          padding: '30px 20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          fontSize: '14px',
          gap: { md: 6 },
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: '2px dashed rgb(153, 153, 153, 0.5)',
          width: '100%',
          minHeight: '80px',
          height: '120px',
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <Typography gutterBottom>
          {multiple
            ? 'Drag & Drop or Click to Upload Files'
            : 'Drag & Drop or Click to Upload a File'}
        </Typography>
        <input
          type="file"
          accept={acceptValue}
          name={name}
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple={multiple}
        />
        <Typography
          gutterBottom
          onClick={openFileDialog}
          style={{
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          {multiple ? 'Browse Files' : 'Browse File'}
        </Typography>
      </Paper>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}
      >
        {uploadedFiles.map((file, index) => (
          <Chip
            key={index}
            label={file.name}
            onDelete={() => handleRemoveFile(index)}
            style={{ margin: 4 }}
          />
        ))}
      </div>
    </>
  );
}

export default FileUploader;
