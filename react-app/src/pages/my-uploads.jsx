import { Icon } from '@iconify/react';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getByUserId } from 'src/apis/media';
import { useUser } from 'src/hooks/use-user';

export default function MyUploadsPage() {
    const [mediaItems, setMediaItems] = useState([]);

    const { user } = useUser();

    useEffect(() => {
        const fetchUserCreatedContent = async () => {
            console.log(user.Id);
            const response = await getByUserId(user.Id);
            setMediaItems(response.data.data);
        };

        fetchUserCreatedContent();
    }, [user.Id]);

    

    return <>
        <Helmet>
            <title>My Uploads | Minimal UI</title>
        </Helmet>
        <Container>
            <Typography variant="h4" sx={{ mb: 5 }}>
                Uploaded Media
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="center">Uploaded Date</TableCell>
                            <TableCell align="center">Price</TableCell>
                            <TableCell align="center">Delivery Method</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mediaItems.map((row) => (
                            <TableRow
                                key={row.Id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.Title}
                                </TableCell>
                                <TableCell align="center">{row.CreatedDate.split('T')[0]}</TableCell>
                                <TableCell align="center">{row.Price}</TableCell>
                                <TableCell align="center">{row.DeliveryMethod}</TableCell>
                                <TableCell align="center">{row.IsApproved.data[0] === 1 ? 'Approved' : 'Pending'}</TableCell>
                                <TableCell align="center">
                                    <Icon icon="mdi-light:pencil" fontSize={20} style={{ marginRight: 10, cursor: 'pointer' }} />
                                    <Icon icon="mdi-light:delete" fontSize={20} style={{ cursor: 'pointer' }} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </>
}