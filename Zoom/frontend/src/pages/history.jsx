import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import VideocamIcon from '@mui/icons-material/Videocam';
import EventIcon from '@mui/icons-material/Event';
import CodeIcon from '@mui/icons-material/Code';
import { Snackbar, Alert, Chip } from '@mui/material';
export default function History() {


    const { getHistoryOfUser } = useContext(AuthContext);

    const [meetings, setMeetings] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')


    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch (e) {
                setSnackbarMessage('Failed to load meeting history');
                setSnackbarOpen(true);
            } finally {
                setIsLoading(false);
            }
        }

        fetchHistory();
    }, [])

    let formatDate = (dateString) => {

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();

        return `${day}/${month}/${year}`

    }

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
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-30%',
                left: '-15%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(255,101,132,0.06) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            }
        }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 4, sm: 6 }, position: 'relative', zIndex: 1 }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            width: 56,
                            height: 56,
                            background: 'linear-gradient(135deg, #6C63FF 0%, #5a52d5 100%)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(108,99,255,0.3)'
                        }}>
                            <EventIcon sx={{ color: 'white', fontSize: '1.8rem' }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" sx={{ 
                                color: '#2c3e50', 
                                fontWeight: 800,
                                letterSpacing: '-0.5px'
                            }}>
                                Meeting History
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#5a6c7d' }}>
                                View all your past meetings
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        startIcon={<HomeIcon />}
                        onClick={() => routeTo('/home')}
                        variant="outlined"
                        sx={{
                            px: 3,
                            py: 1.2,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderWidth: '2px',
                            borderColor: '#6C63FF',
                            color: '#6C63FF',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderWidth: '2px',
                                transform: 'translateY(-2px)',
                                bgcolor: 'rgba(108,99,255,0.05)',
                                boxShadow: '0 8px 24px rgba(108,99,255,0.2)'
                            }
                        }}
                    >
                        Back to Home
                    </Button>
                </Box>

                {isLoading ? (
                    <Grid container spacing={3}>
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Box sx={{
                                    p: 3,
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
                                    border: '1px solid rgba(108,99,255,0.1)',
                                    backdropFilter: 'blur(20px)'
                                }}>
                                    <Skeleton variant="text" width="60%" height={32} sx={{ bgcolor: 'rgba(108,99,255,0.1)', borderRadius: 1 }} />
                                    <Skeleton variant="text" width="40%" height={24} sx={{ bgcolor: 'rgba(108,99,255,0.08)', borderRadius: 1, mt: 1 }} />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    meetings.length !== 0 ? (
                        <Grid container spacing={3}>
                            {meetings.map((e, i) => (
                                <Grid item xs={12} sm={6} md={4} key={i}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            p: 3,
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
                                            border: '1px solid rgba(108,99,255,0.1)',
                                            borderRadius: '20px',
                                            backdropFilter: 'blur(20px)',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 20px 50px rgba(108,99,255,0.2)',
                                                borderColor: 'rgba(108,99,255,0.3)'
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            width: 48,
                                            height: 48,
                                            background: 'linear-gradient(135deg, #6C63FF 0%, #5a52d5 100%)',
                                            borderRadius: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2.5,
                                            boxShadow: '0 6px 18px rgba(108,99,255,0.3)'
                                        }}>
                                            <VideocamIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                                        </Box>
                                        <Typography variant="caption" sx={{ 
                                            color: '#5a6c7d',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            fontWeight: 600,
                                            fontSize: '0.7rem'
                                        }} gutterBottom>
                                            Meeting Code
                                        </Typography>
                                        <Typography variant="h6" sx={{ 
                                            color: '#2c3e50', 
                                            fontWeight: 700,
                                            mb: 1.5,
                                            fontSize: '1.25rem'
                                        }}>
                                            {e.meetingCode}
                                        </Typography>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            gap: 1,
                                            pt: 1.5,
                                            borderTop: '1px solid rgba(108,99,255,0.1)'
                                        }}>
                                            <EventIcon sx={{ color: '#6C63FF', fontSize: '1rem' }} />
                                            <Typography variant="body2" sx={{ color: '#5a6c7d', fontWeight: 500 }}>
                                                {formatDate(e.date)}
                                            </Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 10,
                            px: 3
                        }}>
                            <Box sx={{
                                width: 120,
                                height: 120,
                                mx: 'auto',
                                mb: 3,
                                background: 'linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(255,101,132,0.1) 100%)',
                                borderRadius: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <EventIcon sx={{ fontSize: '4rem', color: '#6C63FF', opacity: 0.6 }} />
                            </Box>
                            <Typography variant="h5" sx={{ 
                                fontWeight: 800, 
                                mb: 1,
                                color: '#2c3e50'
                            }}>
                                No meetings yet
                            </Typography>
                            <Typography variant="body1" sx={{ 
                                mb: 4,
                                color: '#5a6c7d',
                                maxWidth: 400,
                                mx: 'auto'
                            }}>
                                Your past meetings will appear here. Start a meeting to see your history.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => routeTo('/home')}
                                startIcon={<HomeIcon />}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #6C63FF 0%, #5a52d5 100%)',
                                    borderRadius: '14px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 12px 32px rgba(108,99,255,0.45)',
                                        background: 'linear-gradient(135deg, #7b72ff 0%, #6b63e5 100%)'
                                    }
                                }}
                            >
                                Go to Home
                            </Button>
                        </Box>
                    )
                )}
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbarOpen(false)} 
                    severity="error"
                    sx={{
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(211, 47, 47, 0.3)',
                        bgcolor: 'white',
                        border: '1px solid rgba(211, 47, 47, 0.2)'
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}
