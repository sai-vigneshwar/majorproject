import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Grid, Paper, Button, TextField, Typography, Snackbar, Alert, Chip } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import RestoreIcon from '@mui/icons-material/Restore';
import VideocamIcon from '@mui/icons-material/Videocam';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LogoutIcon from '@mui/icons-material/Logout';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import HdIcon from '@mui/icons-material/Hd';
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

    const features = [
        { icon: <AccessTimeIcon />, text: 'Instant Join' },
        { icon: <GroupsIcon />, text: 'Unlimited Guests' },
        { icon: <HdIcon />, text: 'HD Quality' }
    ];

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef3 50%, #dfe7f0 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '-30%',
                right: '-15%',
                width: '700px',
                height: '700px',
                background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }
        }}>
            {/* Header */}
            <Box sx={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                px: { xs: 2, sm: 4 },
                py: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backdropFilter: 'blur(20px)',
                bgcolor: 'rgba(255,255,255,0.6)',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 20px rgba(0,0,0,0.02)'
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'scale(1.02)' }
                }}>
                    <Box sx={{
                        background: 'linear-gradient(135deg, #6C63FF 0%, #5a52d5 100%)',
                        borderRadius: '12px',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(108,99,255,0.3)'
                    }}>
                        <VideocamIcon sx={{ color: 'white', fontSize: '1.8rem' }} />
                    </Box>
                    <Typography variant="h5" sx={{ 
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        letterSpacing: '-0.5px'
                    }}>
                        Zoomify
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Button
                        startIcon={<RestoreIcon />}
                        onClick={() => navigate('/history')}
                        sx={{
                            color: '#5a6c7d',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: 'rgba(108,99,255,0.08)',
                            }
                        }}
                    >
                        History
                    </Button>
                    <Button
                        startIcon={<LogoutIcon />}
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/auth');
                        }}
                        sx={{
                            color: '#5a6c7d',
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: 'rgba(255,101,132,0.08)',
                            }
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* Hero / Content */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Chip 
                                label="🎉 Start Meeting Instantly" 
                                sx={{
                                    mb: 3,
                                    background: 'linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(255,101,132,0.1) 100%)',
                                    border: '1px solid rgba(108,99,255,0.2)',
                                    color: '#6C63FF',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    py: 2.5,
                                    px: 1
                                }}
                            />
                            <Typography variant="h2" sx={{ 
                                fontWeight: 900, 
                                lineHeight: 1.15, 
                                mb: 3,
                                color: '#2c3e50',
                                letterSpacing: '-1px',
                                fontSize: { xs: '2.5rem', md: '3.5rem' }
                            }}>
                                Connect instantly with{' '}
                                <Box component="span" sx={{
                                    background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                    color: 'transparent'
                                }}>
                                    high‑quality
                                </Box>{' '}
                                video calls
                            </Typography>
                            <Typography variant="h6" sx={{ 
                                color: '#5a6c7d', 
                                mb: 4,
                                lineHeight: 1.7,
                                fontWeight: 400
                            }}>
                                Join a meeting by entering a code below. Simple, fast, and secure.
                            </Typography>
                            <Box sx={{ 
                                display: 'flex', 
                                gap: 2, 
                                flexDirection: { xs: 'column', sm: 'row' },
                                mb: 4
                            }}>
                                <TextField
                                    value={meetingCode}
                                    onChange={(e) => setMeetingCode(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleJoinVideoCall()}
                                    label="Meeting Code"
                                    placeholder="e.g. ABCD-1234"
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                            borderRadius: '14px',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.95)',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: 'white',
                                            }
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MeetingRoomIcon sx={{ color: '#6C63FF' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button
                                    onClick={handleJoinVideoCall}
                                    variant="contained"
                                    size="large"
                                    sx={{ 
                                        px: 5,
                                        py: 1.8,
                                        fontSize: '1.05rem',
                                        background: 'linear-gradient(135deg, #6C63FF 0%, #5a52d5 100%)',
                                        borderRadius: '14px',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 32px rgba(108,99,255,0.45)',
                                            background: 'linear-gradient(135deg, #7b72ff 0%, #6b63e5 100%)'
                                        }
                                    }}
                                >
                                    Join Now
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {features.map((feature, index) => (
                                    <Box key={index} sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1,
                                        px: 2,
                                        py: 1,
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(108,99,255,0.1)'
                                    }}>
                                        <Box sx={{ 
                                            color: '#6C63FF',
                                            display: 'flex',
                                            '& svg': { fontSize: '1.2rem' }
                                        }}>
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="body2" sx={{ 
                                            color: '#5a6c7d', 
                                            fontWeight: 600 
                                        }}>
                                            {feature.text}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                position: 'relative',
                                p: { xs: 2, sm: 3 },
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
                                border: '1px solid rgba(108,99,255,0.1)',
                                borderRadius: '28px',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 20px 60px rgba(108,99,255,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 30px 80px rgba(108,99,255,0.25)'
                                }
                            }}
                        >
                            <Box component="img"
                                 src='/logo3.png'
                                 alt='Video meeting illustration'
                                 sx={{
                                     maxWidth: '100%',
                                     height: 'auto',
                                     borderRadius: '20px',
                                     filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.1))'
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
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbarOpen(false)} 
                    severity="warning"
                    sx={{
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(237, 108, 2, 0.3)',
                        bgcolor: 'white',
                        border: '1px solid rgba(237, 108, 2, 0.2)'
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}


export default withAuth(HomeComponent)