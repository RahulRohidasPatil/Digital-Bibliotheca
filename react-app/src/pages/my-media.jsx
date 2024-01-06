import { Icon } from '@iconify/react';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getMediaPurchases } from 'src/apis/purchase';
import { useUser } from 'src/hooks/use-user';
import { useRouter } from 'src/routes/hooks';

export default function MyMediaPage() {
    const [mediaItems, setMediaItems] = useState([]);

    const {user} = useUser();

    const router = useRouter();

    useEffect(() => {
        const fetchPurchasedMedia = async () => {
            const response = await getMediaPurchases(user.Id);
            setMediaItems(response.data.data);
        };

        
        fetchPurchasedMedia();
    }, [user.Id]);

    

    const startChat = (targetId) => () => {
        router.replace(`/chats/${targetId}`)
    }

    const downloadFiles = (mediaId) => () => {
        const media = mediaItems.filter((item) => item.MediaId === mediaId)[0]

        media.files.forEach((item, i) => {
            window.open(item.FilePath, '_blank', 'noreferrer')
        })
    }

    const viewMedia = (mediaId) => () => {
        router.replace(`/product/${mediaId}`)
    }

    const resolveDeliveryMethod = (deliveryMethod) => deliveryMethod === 2 ? 'Contact' : 'Instant';

    return <>
        <Helmet>
            <title>My Media | Minimal UI</title>
        </Helmet>
        <Container>
            <Typography variant="h4" sx={{ mb: 5 }}>
                Purchased Media
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="center">PurchasedDate</TableCell>
                            <TableCell align="center">DeliveryMethod</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mediaItems.map((row) => (
                            <TableRow
                                key={row.PurchaseId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.Title}
                                </TableCell>
                                <TableCell align="center">{row.PurchaseDate.split('T')[0]}</TableCell>
                                <TableCell align="center">{resolveDeliveryMethod(row.DeliveryMethod)}</TableCell>
                                <TableCell align="center">
                                    
                                    {(row.DeliveryMethod === 1) ? (<Icon onClick={downloadFiles(row.MediaId)} icon="iconoir:download" fontSize={20} style={{ marginRight: 10, cursor: 'pointer' }} />) : null}
                                    <Icon onClick={startChat(row.OwnerId)} icon="mdi:chat-outline" fontSize={20} style={{ marginRight: 10, cursor: 'pointer' }} />
                                    <Icon onClick={viewMedia(row.MediaId)} icon="clarity:details-line" fontSize={20} style={{ cursor: 'pointer' }} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </>
}