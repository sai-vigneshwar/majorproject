import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Box,
    Container,
    Typography,
    Button,
    IconButton,
    Paper,
    Stack
} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LoginIcon from '@mui/icons-material/Login';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export default function LandingPage() {
    const router = useNavigate();

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f1020 0%, #1b1c36 50%, #2a1f4a 100%)'
        }}>
            {/* Nav */}
            <Box sx={{
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
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>
                        PopMeet
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Button
                        startIcon={<RocketLaunchIcon />}
                        onClick={() => router('/aljk23')}
                        sx={{ color: 'white' }}
                    >
                        Join as Guest
                    </Button>
                    <Button
                        startIcon={<PersonAddAltIcon />}
                        onClick={() => router('/auth')}
                        sx={{ color: 'white' }}
                    >
                        Register
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<LoginIcon />}
                        onClick={() => router('/auth')}
                    >
                        Login
                    </Button>
                </Stack>
            </Box>

            {/* Hero */}
            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={5} alignItems="center">
                    <Box sx={{ flex: 1, color: 'white' }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 900,
                                lineHeight: 1.1,
                                mb: 2,
                                letterSpacing: -0.5
                            }}
                        >
                            <Box component="span" sx={{
                                background: 'linear-gradient(90deg, #FF9839, #FF6584)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }}>Connect</Box>{' '}with your loved ones
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                            Cover the distance with PopMeet. Seamless, secure, and fast.
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button
                                component={Link}
                                to="/auth"
                                variant="contained"
                                size="large"
                                sx={{ px: 4, py: 1.4 }}
                            >
                                Get Started
                            </Button>
                            <Button
                                color="secondary"
                                onClick={() => router('/aljk23')}
                                sx={{ color: 'white' }}
                            >
                                Try as Guest
                            </Button>
                        </Stack>
                    </Box>

                    <Box sx={{ flex: 1, width: '100%' }}>
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
                            <Box
                                component="img"
                                src="/mobile.png"
                                alt="App preview"
                                sx={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    transform: 'perspective(900px) rotateY(8deg)',
                                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))'
                                }}
                            />
                        </Paper>
                    </Box>
                </Stack>
            </Container>
        </Box>
    )
}
