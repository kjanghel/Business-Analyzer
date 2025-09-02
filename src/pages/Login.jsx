import React, { useState } from 'react';
import users from '../data/users.json';
import { login as setLoggedIn } from '../utils/auth';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const MobileContainer = styled(Paper)(({ theme }) => ({
  maxWidth: 400,
  margin: '40px auto',
  borderRadius: 24,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
}));

const MobileButton = styled(Button)({
  borderRadius: 16,
  fontSize: '1.1rem',
  padding: '12px 0',
  background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
  color: '#fff',
  boxShadow: '0 4px 12px rgba(67,233,123,0.15)',
});

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const found = users.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setLoggedIn(username);
      navigate('/home');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f6f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <MobileContainer elevation={3}>
        <Typography variant="h5" align="center" fontWeight={700} mb={2}>
          Welcome Back
        </Typography>
        <Typography variant="body2" align="center" mb={3} color="text.secondary">
          Sign in to continue
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            InputProps={{ style: { borderRadius: 12 } }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            InputProps={{ style: { borderRadius: 12 } }}
          />
          {error && (
            <Typography color="error" align="center" mt={1}>
              {error}
            </Typography>
          )}
          <MobileButton type="submit" fullWidth sx={{ mt: 3 }}>
            Login
          </MobileButton>
        </form>
      </MobileContainer>
    </Box>
  );
}
