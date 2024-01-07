import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { editProfile } from 'src/apis/media';
import { useUser } from 'src/hooks/use-user';
import { useRouter } from 'src/routes/hooks';

export default function EditProfile() {
    const { user } = useUser();
    const router = useRouter();
    const [emailAddress, setEmailAddress] = useState(user?.EmailAddress);
    const [phoneNumber, setPhoneNumber] = useState(user?.PhoneNumber);
    const [loading] = useState(false);

    function handleSubmit(event){
        event.preventDefault();
        editProfile(user.Id, emailAddress, phoneNumber);
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
                                        label="Email Address"
                                        type="text"
                                        name="title"
                                        value={emailAddress}
                                        onChange={e => setEmailAddress(e.target.value)}
                                        fullWidth
                                        margin="none"
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Phone Number"
                                        type="text"
                                        name="price"
                                        value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value)}
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