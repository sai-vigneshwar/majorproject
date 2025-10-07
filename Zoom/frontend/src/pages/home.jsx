import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Grid, Paper, Button, IconButton, TextField, Typography, Snackbar, Alert } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import RestoreIcon from '@mui/icons-material/Restore';
import VideocamIcon from '@mui/icons-material/Videocam';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {


    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");


    const {addToUserHistory} = useContext(AuthContext);
    let handleJoinVideoCall = async () => {
        const trimmed = meetingCode.trim();
        if (!trimmed) {
            setSnackbarMessage('Please enter a meeting code');
            setSnackbarOpen(true);
            return;
        }
        await addToUserHistory(trimmed);
        navigate(`/${trimmed}`)
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f1020 0%, #1b1c36 50%, #2a1f4a 100%)'
        }}>
            {/* Header */}
            <Box sx={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                px: { xs: 2, sm: 3 },
                py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'rgba(255,255,255,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.12)'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VideocamIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                        Zoomify
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Button
                        startIcon={<RestoreIcon />}
                        onClick={() => navigate('/history')}
                        sx={{ color: 'white' }}
                    >
                        History
                    </Button>
                    <Button
                        startIcon={<LogoutIcon />}
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/auth');
                        }}
                        sx={{ color: 'white' }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* Hero / Content */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ color: 'white' }}>
                            <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 2 }}>
                                Connect instantly with high‑quality video calls
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                                Join a meeting by entering a code below. Simple, fast, and secure.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                <TextField
                                    value={meetingCode}
                                    onChange={(e) => setMeetingCode(e.target.value)}
                                    label="Meeting Code"
                                    placeholder="e.g. ABCD-1234"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.08)',
                                        borderRadius: 2,
                                        minWidth: { xs: '100%', sm: 280 }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MeetingRoomIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button
                                    onClick={handleJoinVideoCall}
                                    variant="contained"
                                    size="large"
                                    sx={{ px: 4, py: 1.3 }}
                                >
                                    Join
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                bgcolor: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: 4,
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Box component="img"
                                 srcSet='/logo3.png'
                                 alt='App illustration'
                                 sx={{
                                     maxWidth: '100%',
                                     height: 'auto',
                                     transform: 'perspective(900px) rotateY(-6deg)',
                                     filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))'
                                 }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="warning" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}


export default withAuth(HomeComponent)