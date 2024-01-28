import { Alert, Box, Button, Grid, Snackbar, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { editProfile } from 'src/apis/media';
import { useUser } from 'src/hooks/use-user';

export default function EditProfile() {
    const { user } = useUser();
    // It's a good practice to initialize your state with default values. 
    const [firstName, setFirstName] = useState(user?.FirstName);
    const [familyName, setFamilyName] = useState(user?.FamilyName);
    const [phoneNumber, setPhoneNumber] = useState(user?.PhoneNumber);
    const [loading] = useState(false);

    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState(false);
    const [snackBarSeverity, setSnackBarSeverity] = useState('success');

// The Snackbar component has a severity prop, which can be directly used for the severity. You might not need a separate state for it.
    async function handleSubmit(event){
        event.preventDefault();
        // Add proper error handling in your editProfile function and handle errors accordingly in the handleSubmit function.
        await editProfile(user.Id, firstName, familyName, phoneNumber);
        localStorage.setItem("user", JSON.stringify({ ...user, FirstName: firstName, FamilyName: familyName, PhoneNumber: phoneNumber }))
        setSnackbarMessage("Profile Updated Successfully");
        setSnackBarSeverity("success");
        setShowSnackbar(true);
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
                                        label="First Name"
                                        type="text"
                                        name="title"
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Family Name"
                                        type="text"
                                        name="title"
                                        value={familyName}
                                        onChange={e => setFamilyName(e.target.value)}
                                        fullWidth
                                        margin="normal"
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
                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={showSnackbar}
                            autoHideDuration={2000}
                            onClose={() => setShowSnackbar(false)}
                            message={snackbarMessage}
                        >
                            <Alert onClose={() => showSnackbar(false)} severity={snackBarSeverity} sx={{ width: '100%' }}>
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>
                </Box>
            )}
        </>
    );
};