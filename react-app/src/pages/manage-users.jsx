import { Icon } from '@iconify/react';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getUsers, banUser, unbanUser } from 'src/apis/admin';
import { useUser } from 'src/hooks/use-user';
import { useRouter } from 'src/routes/hooks';

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);

    const {user} = useUser();

    const router = useRouter();

    useEffect(() => {
        if(user.Role !== 2){
            router.replace("/");
        }

        const fetchUsers = async () => {
            const response = await getUsers();
            setUsers(response.data.data.filter((item) => item.Role !== 2));
        };

        fetchUsers();
    }, [user, router])

    const resolveUserStatus = (status) => status === 2 ? "Banned" : "Active";
    
    const resolveUserRole = (role) => role === 2 ? "Admin" : "User";

    const restrictUser = (id) => async () => {
        await banUser(id);
        router.reload();
    };

    const activateUser = (id) => async () => {
        await unbanUser(id);
        router.reload();
    };

    return <>
        <Helmet>
            <title>Manage Users</title>
        </Helmet>

        <Container>
            <Typography variant="h4" sx={{mb: 5}}>
                Manage Users
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="center">Role</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row) => (
                            <TableRow
                                key={row.Id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {`${row.FirstName} ${row.FamilyName}`}
                                </TableCell>
                                <TableCell align="center">{resolveUserRole(row.Role)}</TableCell>
                                <TableCell align="center">{resolveUserStatus(row.Status)}</TableCell>
                                <TableCell align="center">
                                    
                                    { row.Status === 2 ? <Icon onClick={activateUser(row.Id)} icon="mdi:check" fontSize={20} style={{ marginRight: 10, cursor: 'pointer' }} /> : <Icon onClick={restrictUser(row.Id)} icon="mdi:ban" fontSize={20} style={{ marginRight: 10, cursor: 'pointer' }} />}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </>
}