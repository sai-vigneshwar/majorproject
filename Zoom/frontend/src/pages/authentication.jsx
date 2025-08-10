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
import { AuthContext } from '../contexts/AuthContext';



const defaultTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#6C63FF' },
        secondary: { main: '#FF6584' },
        background: { default: '#0f1020' }
    },
    shape: { borderRadius: 14 },
    typography: {
        fontFamily: 'Inter, Poppins, Roboto, Arial, sans-serif'
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', borderRadius: 12, fontWeight: 600 }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: { borderRadius: 16 }
            }
        },
        MuiTextField: {
            defaultProps: { variant: 'outlined' }
        }
    }
});

export default function Authentication() {

    

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
            <Grid
                container
                component="main"
                sx={{
                    height: '100vh',
                    background: 'linear-gradient(135deg, #0f1020 0%, #1b1c36 50%, #2a1f4a 100%)'
                }}
            >
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage:
                            'radial-gradient(ellipse at 20% 20%, rgba(108,99,255,0.35), rgba(255,101,132,0) 70%), url(/mobile.png)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={0}
                    square
                    sx={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 420,
                            mx: 4,
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2.5,
                            borderRadius: 4,
                            bgcolor: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                            backdropFilter: 'blur(12px)'
                        }}
                    >
                        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', boxShadow: 3 }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography component="h1" variant="h5" color="white" fontWeight={700}>
                                Welcome
                            </Typography>
                            <Typography variant="body2" color="rgba(255,255,255,0.75)">
                                {formState === 0 ? 'Sign in to continue' : 'Create your account'}
                            </Typography>
                        </Box>

                        <ToggleButtonGroup
                            color="primary"
                            value={formState}
                            exclusive
                            onChange={handleToggle}
                            fullWidth
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.06)',
                                borderRadius: 3,
                                p: 0.5
                            }}
                        >
                            <ToggleButton value={0} sx={{ flex: 1 }}>Sign In</ToggleButton>
                            <ToggleButton value={1} sx={{ flex: 1 }}>Sign Up</ToggleButton>
                        </ToggleButtonGroup>

                        <Box component="form" noValidate sx={{ width: '100%' }}>
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
                                                <AccountCircle />
                                            </InputAdornment>
                                        )
                                    }}
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
                                onChange={(e) => setUsername(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    )
                                }}
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
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{ mt: 3, mb: 1.5, py: 1.2 }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? 'Login' : 'Register'}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar

                open={open}
                autoHideDuration={4000}
                message={message}
                onClose={handleCloseSnackbar}
            />

        </ThemeProvider>
    );
}