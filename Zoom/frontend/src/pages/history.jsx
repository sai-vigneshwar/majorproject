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
import { IconButton, Snackbar, Alert } from '@mui/material';
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
            background: 'linear-gradient(135deg, #0f1020 0%, #1b1c36 50%, #2a1f4a 100%)',
            py: { xs: 4, sm: 6 },
            px: { xs: 2, sm: 3 }
        }}>
            <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <IconButton
                        onClick={() => routeTo('/home')}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.08)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.12)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' }
                        }}
                    >
                        <HomeIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>Meeting History</Typography>
                </Box>

                {isLoading ? (
                    <Grid container spacing={2.5}>
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    bgcolor: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.12)'
                                }}>
                                    <Skeleton variant="text" width="60%" height={28} sx={{ bgcolor: 'grey.800' }} />
                                    <Skeleton variant="text" width="40%" height={20} sx={{ bgcolor: 'grey.800' }} />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    meetings.length !== 0 ? (
                        <Grid container spacing={2.5}>
                            {meetings.map((e, i) => (
                                <Grid item xs={12} sm={6} md={4} key={i}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            height: '100%',
                                            bgcolor: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            backdropFilter: 'blur(8px)',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 12px 30px rgba(0,0,0,0.35)'
                                            }
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.75)' }} gutterBottom>
                                                Meeting Code
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }} gutterBottom>
                                                {e.meetingCode}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                                                Date: {formatDate(e.date)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.85)', py: 8 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>No meetings yet</Typography>
                            <Typography variant="body2" sx={{ mb: 3 }}>Your past meetings will appear here.</Typography>
                            <Button
                                variant="contained"
                                onClick={() => routeTo('/home')}
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}
