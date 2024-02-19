import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getByID, isOwner, updateMedia } from 'src/apis/media';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';
import { useUser } from 'src/hooks/use-user';
import { useRouter } from 'src/routes/hooks';


const EditUploadContent = () => {
  const {id} = useParams();
  const {user} = useUser();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
   
    const loadMedia = async () => {
        const owner = await isOwner(id, user.Id);
        if(!owner.data.data){
            router.replace("/");
        }
        const product = (await getByID(id)).data.data[0];
        setTitle(product.Title);
        setPrice(product.Price);
        setDescription(product.Description);
    }
    loadMedia();
    setLoading(false);
    // eslint-disable-next-line
  }, [id]);

  const [loading, setLoading] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMedia(id, {Title: title, Description: description, Price: price});
    router.replace("/my-uploads");
  };

  return (
    <>
      {loading === true ? (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography style={{ fontSize: '24px', color: 'black' }}>Loading...</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            px: '16px',
            padding: { sm: '0px 14px', lg: '0px 8px' },
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
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    fullWidth
                    margin="none"
                  />
                </div>

                <div>
                  <TextField
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    fullWidth
                    onChange={e => setDescription(e.target.value)}
                    value={description}
                    margin="normal"
                  />
                </div>

                <div>
                  <TextField
                    label="Price"
                    type="number"
                    name="price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    fullWidth
                    margin="normal"
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
        </Box>
      )}
    </>
  );
};

export default EditUploadContent;