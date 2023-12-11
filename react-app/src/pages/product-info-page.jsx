import { Box, Button, Card, Container, Grid, Rating, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMedia } from "src/apis/media";

export default function ProductInfoPage() {
    const { id } = useParams();
    const [product, setproduct] = useState();

    useEffect(() => {
        getMedia(id)
            .then(response => setproduct(response.data.data[0]));
    }, [id]);

    return <Container>
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
                            src={product?.FilePath}
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
                    Description: {product?.Description}
                </Typography>
                <Typography sx={{ marginTop: 2 }} variant="caption" component="div">
                    Pricing: {product?.Price}
                </Typography>
                <Typography sx={{ marginTop: 2 }} variant="caption" component="div">
                    Content Type: {product?.MediaType}
                </Typography>
                <Typography sx={{ marginTop: 2 }} variant="caption" component="div">
                    Released on: {product?.CreatedDate.split('T')[0]}
                </Typography>
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
                    }}
                >
                    Chat with Creator
                </Button>
            </Grid>
        </Grid>
    </Container>
}