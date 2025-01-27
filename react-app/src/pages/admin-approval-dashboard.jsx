/* eslint-disable */

// import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { getUnapprovedMedia, verifyMedia } from 'src/apis/admin';
import ProductCard from '../sections/products/product-card';

export default function AdminMediaApprovalDashboard() {
  /* 
  Peer Review by Rahul - use camelCase for state variable
  Reference: https://react.dev/learn/state-a-components-memory#anatomy-of-usestate
  */
  /* Response to Peer Review by Hauva - Thank you for the suggestion.Will keep this in mind*/
  const [pendingApprovalMedia, setPendingApprovalMedia] = useState([]);

  /* 
  Peer Review by Rahul - Implement Error Handling in case there is an error in the API call
  */
  //  Response to Peer Review by Hauva - Implemented the advised changes
  const fetchPendingMedia = async () => {
    try {
      const data = await getUnapprovedMedia();
      setPendingApprovalMedia(data?.data || []);
    } catch (error) {
      console.log(error, 'error in fetching  unapproved data');
    }
  };

  useEffect(() => {
    fetchPendingMedia();
  }, []);

  const onHandleAction = async (id, value) => {
    await verifyMedia(id, value);
    fetchPendingMedia();
  };

  return (
    // <Helmet>
    //     <title>Admin Dashboard | Minimal UI</title>
    // </Helmet>
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Media Approval Dashboard
      </Typography>
      <Grid container spacing={3}>
        {pendingApprovalMedia.length ? (
          pendingApprovalMedia.map((media) => (
            <Grid item key={media.Id} xs={12} sm={6} md={4}>
              <ProductCard
                product={media}
                adminAction={
                  <CardActions>
                    <Button size="small" onClick={() => onHandleAction(media.Id, 1)}>
                      Approve
                    </Button>
                    <Button size="small" onClick={() => onHandleAction(media.Id, 2)}>
                      Reject
                    </Button>
                  </CardActions>
                }
              />
            </Grid>
          ))
        ) : (
          <Typography variant="h4" xs={12} sm={6} md={6}>
            There are no pending approvals
          </Typography>
        )}
      </Grid>
      {/* Display approved and rejected media ids for demonstration purposes */}
      {/* <Typography variant="h6" sx={{ mt: 4 }}>
        Approved Media: {approvedMedia.join(', ')}
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Rejected Media: {rejectedMedia.join(', ')}
      </Typography> */}
    </Container>
  );
}
