import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMedia } from "src/apis/media";

export default function ProductInfoPage() {
    const { id } = useParams();
    const [productDetails, setProductDetails] = useState();

    useEffect(() => {
        getMedia(id)
            .then(response => setProductDetails(response.data.data));
    }, [id]);

    return <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
            {productDetails?.Title}
        </Typography>


    </Container>
}