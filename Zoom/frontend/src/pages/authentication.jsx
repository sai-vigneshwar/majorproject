import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Snackbar, Alert, InputAdornment, IconButton } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';



const defaultTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#6C63FF' },
        secondary: { main: '#FF6584' },
        background: { default: '#f5f7fa' }
    },
    shape: { borderRadius: 14 },
    typography: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif'
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { 
                    textTransform: 'none', 
                    borderRadius: 12, 
                    fontWeight: 600,
                    padding: '10px 24px'
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: { borderRadius: 20 }
            }
        },
        MuiTextField: {
            defaultProps: { variant: 'outlined' },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        borderRadius: '12px',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.85)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: 'rgba(255,255,255,0.95)',
                        }
                    }
                }
            }
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '10px',
                    border: 'none',
                    color: '#5a6c7d',
                    '&.Mui-selected': {
                        backgroundColor: 'white',
                        color: '#6C63FF',
                        boxShadow: '0 2px 8px rgba(108,99,255,0.2)',
                        '&:hover': {
                            backgroundColor: 'white',
                        }
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.5)',
                    }
                }
            }
        }
    }
});

export default function Authentication() {

    const navigate = useNavigate();

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");


    const [formState, setFormState] = React.useState(0);

    const [open, setOpen] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);


    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {

                let result = await handleLogin(username, password)


            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("")
                setFormState(0)
                setPassword("")
            }
        } catch (err) {

            console.log(err);
            let message = (err.response.data.message);
            setError(message);
        }
    }

    const handleToggle = (_event, newValue) => {
        if (newValue !== null) {
            setFormState(newValue);
            setError("");
        }
    };

    const handleCloseSnackbar = () => setOpen(false);


    return (
        <ThemeProvider theme={defaultTheme}>
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
                    background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-30%',
                    left: '-15%',
                    width: '700px',
                    height: '700px',
                    background: 'radial-gradient(circle, rgba(255,101,132,0.08) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }
            }}>
                <CssBaseline />
                
                {/* Header with back button */}
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
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
                    <Box 
                        onClick={() => navigate('/')}
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease',
                            '&:hover': { transform: 'scale(1.02)' }
                        }}
                    >
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
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/')}
                        sx={{
                            color: '#5a6c7d',
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: 'rgba(108,99,255,0.08)',
                            }
                        }}
                    >
                        Back to Home
                    </Button>
                </Box>

                <Grid
                    container
                    component="main"
                    sx={{ minHeight: '100vh', position: 'relative', zIndex: 1, pt: 10 }}
                >
                    {/* Left side - Decorative */}
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 4,
                            position: 'relative'
                        }}
                    >
                        <Box sx={{
                            maxWidth: '500px',
                            textAlign: 'center',
                            display: { xs: 'none', sm: 'block' }
                        }}>
                            <Box
                                component="img"
                                src="/mobile.png"
                                alt="Video conferencing"
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    filter: 'drop-shadow(0 20px 40px rgba(108,99,255,0.2))',
                                    animation: 'float 6s ease-in-out infinite',
                                    '@keyframes float': {
                                        '0%, 100%': { transform: 'translateY(0px)' },
                                        '50%': { transform: 'translateY(-20px)' }
                                    }
                                }}
                            />
                            <Typography variant="h4" sx={{
                                mt: 4,
                                fontWeight: 800,
                                color: '#2c3e50',
                                mb: 2
                            }}>
                                Join the Future of{' '}
                                <Box component="span" sx={{
                                    background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                    color: 'transparent'
                                }}>
                                    Communication
                                </Box>
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#5a6c7d', lineHeight: 1.7 }}>
                                Experience seamless video meetings with crystal-clear quality and enterprise-grade security.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Right side - Form */}
                    <Grid
                        item
                        xs={12}
                        sm={8}
                        md={5}
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            p: { xs: 2, sm: 4 }
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: 480,
                                p: { xs: 3, sm: 5 },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 3,
                                borderRadius: '28px',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                                border: '1px solid rgba(108,99,255,0.15)',
                                boxShadow: '0 20px 60px rgba(108,99,255,0.15)',
                                backdropFilter: 'blur(20px)'
                            }}
                        >
                            {/* Avatar */}
                            <Box sx={{
                                width: 72,
                                height: 72,
                                background: 'linear-gradient(135deg, #6C63FF 0%, #5a52d5 100%)',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
                                mb: 1
                            }}>
                                <LockOutlinedIcon sx={{ color: 'white', fontSize: '2rem' }} />
                            </Box>

                            {/* Title */}
                            <Box sx={{ textAlign: 'center', mb: 1 }}>
                                <Typography component="h1" variant="h4" sx={{ 
                                    fontWeight: 800, 
                                    color: '#2c3e50',
                                    mb: 1,
                                    letterSpacing: '-0.5px'
                                }}>
                                    Welcome Back
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#5a6c7d' }}>
                                    {formState === 0 ? 'Sign in to your account' : 'Create a new account'}
                                </Typography>
                            </Box>

                            {/* Toggle Buttons */}
                            <ToggleButtonGroup
                                color="primary"
                                value={formState}
                                exclusive
                                onChange={handleToggle}
                                fullWidth
                                sx={{
                                    bgcolor: 'rgba(108,99,255,0.08)',
                                    borderRadius: '14px',
                                    p: 0.6,
                                    gap: 0.5
                                }}
                            >
                                <ToggleButton value={0} sx={{ flex: 1, py: 1.2 }}>Sign In</ToggleButton>
                                <ToggleButton value={1} sx={{ flex: 1, py: 1.2 }}>Sign Up</ToggleButton>
                            </ToggleButtonGroup>

                            {/* Form */}
                            <Box 
                                component="form" 
                                noValidate 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAuth();
                                }}
                                sx={{ width: '100%' }}
                            >
                                {formState === 1 && (
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="fullName"
                                        label="Full Name"
                                        name="fullName"
                                        value={name}
                                        autoFocus
                                        onChange={(e) => setName(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountCircle sx={{ color: '#6C63FF' }} />
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ mb: 2 }}
                                    />
                                )}

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    value={username}
                                    autoFocus={formState === 0}
                                    onChange={(e) => setUsername(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountCircle sx={{ color: '#6C63FF' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    value={password}
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword((s) => !s)}
                                                    edge="end"
                                                    sx={{ color: '#6C63FF' }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ mb: 2 }}
                                />

                                {error && (
                                    <Alert 
                                        severity="error" 
                                        sx={{ 
                                            mt: 2,
                                            borderRadius: '12px',
                                            bgcolor: 'rgba(211, 47, 47, 0.08)',
                                            border: '1px solid rgba(211, 47, 47, 0.2)'
                                        }}
                                    >
                                        {error}
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{ 
                                        mt: 3,
                                        py: 1.6,
                                        fontSize: '1.05rem',
                                        background: 'linear-gradient(135deg, #6C63FF 0%, #5a52d5 100%)',
                                        borderRadius: '14px',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 32px rgba(108,99,255,0.45)',
                                            background: 'linear-gradient(135deg, #7b72ff 0%, #6b63e5 100%)'
                                        }
                                    }}
                                >
                                    {formState === 0 ? 'Sign In' : 'Create Account'}
                                </Button>

                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        mt: 3, 
                                        textAlign: 'center',
                                        color: '#5a6c7d'
                                    }}
                                >
                                    {formState === 0 ? "Don't have an account? " : "Already have an account? "}
                                    <Box 
                                        component="span"
                                        onClick={() => {
                                            setFormState(formState === 0 ? 1 : 0);
                                            setError("");
                                        }}
                                        sx={{
                                            color: '#6C63FF',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        {formState === 0 ? 'Sign up' : 'Sign in'}
                                    </Box>
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Snackbar
                    open={open}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity="success"
                        sx={{ 
                            borderRadius: '12px',
                            boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
                            bgcolor: 'white',
                            border: '1px solid rgba(76, 175, 80, 0.2)'
                        }}
                    >
                        {message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
}
