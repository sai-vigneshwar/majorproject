import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    Stack,
    Grid,
    Chip,
    useTheme,
    alpha
} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import LoginIcon from '@mui/icons-material/Login';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function LandingPage() {
    const router = useNavigate();
    const theme = useTheme();

    const features = [
        { icon: <SecurityIcon />, title: 'Secure & Private', description: 'End-to-end encrypted meetings' },
        { icon: <SpeedIcon />, title: 'Lightning Fast', description: 'Crystal clear HD video quality' },
        { icon: <GroupsIcon />, title: 'Team Collaboration', description: 'Connect with unlimited participants' }
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
                top: '-50%',
                right: '-20%',
                width: '800px',
                height: '800px',
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
            {/* Navigation */}
            <Box sx={{
                position: 'relative',
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
                <Button
                    variant="contained"
                    startIcon={<LoginIcon />}
                    onClick={() => router('/auth')}
                    sx={{
                        px: 3,
                        py: 1.2,
                        background: 'linear-gradient(135deg, #6C63FF 0%, #5a52d5 100%)',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        boxShadow: '0 4px 14px rgba(108,99,255,0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(108,99,255,0.4)',
                            background: 'linear-gradient(135deg, #7b72ff 0%, #6b63e5 100%)'
                        }
                    }}
                >
                    Sign In
                </Button>
            </Box>

            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 8, md: 12 } }}>
                <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    spacing={6} 
                    alignItems="center"
                    sx={{ mb: 8 }}
                >
                    {/* Left Content */}
                    <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                        <Chip 
                            label="🚀 New: AI-powered features" 
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
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 900,
                                lineHeight: 1.15,
                                mb: 3,
                                letterSpacing: '-2px',
                                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.2rem' }
                            }}
                        >
                            <Box component="span" sx={{
                                background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }}>
                                Connect
                            </Box>
                            <br />
                            <Box component="span" sx={{ color: '#2c3e50' }}>
                                Without Limits
                            </Box>
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: '#5a6c7d',
                                mb: 4,
                                lineHeight: 1.7,
                                fontWeight: 400,
                                maxWidth: '500px',
                                mx: { xs: 'auto', md: 0 }
                            }}
                        >
                            Experience seamless video conferencing with crystal-clear quality.
                            Connect with anyone, anywhere, anytime.
                        </Typography>
                        <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            spacing={2} 
                            sx={{ 
                                justifyContent: { xs: 'center', md: 'flex-start' },
                                mb: 4
                            }}
                        >
                            <Button
                                component={Link}
                                to="/auth"
                                variant="contained"
                                size="large"
                                sx={{
                                    px: 5,
                                    py: 1.8,
                                    fontSize: '1.1rem',
                                    background: 'linear-gradient(135deg, #6C63FF 0%, #5a52d5 100%)',
                                    borderRadius: '14px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 12px 32px rgba(108,99,255,0.45)',
                                        background: 'linear-gradient(135deg, #7b72ff 0%, #6b63e5 100%)'
                                    }
                                }}
                            >
                                Get Started Free
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    px: 5,
                                    py: 1.8,
                                    fontSize: '1.1rem',
                                    borderRadius: '14px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    borderWidth: '2px',
                                    borderColor: '#6C63FF',
                                    color: '#6C63FF',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderWidth: '2px',
                                        transform: 'translateY(-3px)',
                                        bgcolor: 'rgba(108,99,255,0.05)',
                                        boxShadow: '0 8px 24px rgba(108,99,255,0.2)'
                                    }
                                }}
                            >
                                Learn More
                            </Button>
                        </Stack>
                        <Stack direction="row" spacing={3} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            {['No Credit Card', 'Unlimited Meetings', 'HD Quality'].map((item) => (
                                <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: '#6C63FF', fontSize: '1.2rem' }} />
                                    <Typography variant="body2" sx={{ color: '#5a6c7d', fontWeight: 500 }}>
                                        {item}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    {/* Right Image */}
                    <Box sx={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
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
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 30px 80px rgba(108,99,255,0.25)'
                                }
                            }}
                        >
                            <Box
                                component="img"
                                src="/mobile.png"
                                alt="Video conferencing preview"
                                sx={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: '20px',
                                    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.1))'
                                }}
                            />
                            {/* Floating badge */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 20,
                                    right: 20,
                                    px: 2,
                                    py: 1,
                                    background: 'linear-gradient(135deg, #6C63FF 0%, #5a52d5 100%)',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 14px rgba(108,99,255,0.4)',
                                    animation: 'float 3s ease-in-out infinite',
                                    '@keyframes float': {
                                        '0%, 100%': { transform: 'translateY(0px)' },
                                        '50%': { transform: 'translateY(-10px)' }
                                    }
                                }}
                            >
                                <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                                    HD Quality
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                </Stack>

                {/* Features Section */}
                <Box sx={{ mt: { xs: 8, md: 12 } }}>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            textAlign: 'center',
                            fontWeight: 800,
                            mb: 2,
                            color: '#2c3e50',
                            letterSpacing: '-1px'
                        }}
                    >
                        Why Choose Zoomify?
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            textAlign: 'center',
                            color: '#5a6c7d',
                            mb: 6,
                            maxWidth: '600px',
                            mx: 'auto'
                        }}
                    >
                        Built with cutting-edge technology to deliver the best video conferencing experience
                    </Typography>
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        height: '100%',
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
                                    <Box
                                        sx={{
                                            width: '56px',
                                            height: '56px',
                                            background: 'linear-gradient(135deg, #6C63FF 0%, #5a52d5 100%)',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 3,
                                            boxShadow: '0 8px 24px rgba(108,99,255,0.3)',
                                            '& svg': { color: 'white', fontSize: '1.8rem' }
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#2c3e50' }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#5a6c7d', lineHeight: 1.7 }}>
                                        {feature.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    )
}
