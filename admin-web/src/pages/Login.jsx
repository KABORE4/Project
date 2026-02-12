import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Security,
  Phone 
} from '@mui/icons-material';
import { login, verify2FA } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Vérifier si ce sont les identifiants par défaut à bloquer
      if (formData.email === 'test@example.com' && formData.password === 'password123') {
        setError('Default credentials are disabled. Please use different credentials.');
        return;
      }

      // N'autoriser que l'administrateur
      if (formData.email === 'admin@agrisync.com' && formData.password === 'admin123') {
        const mockUser = {
          id: Date.now().toString(),
          email: formData.email,
          name: 'Administrator',
          role: 'admin'
        };

        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockRefreshToken = 'mock-refresh-token-' + Date.now();

        // Simuler une réponse API réussie
        localStorage.setItem('token', mockToken);
        localStorage.setItem('refreshToken', mockRefreshToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        // Redirection directe vers dashboard
        window.location.href = '/';
        return;
      }

      // Bloquer toutes les autres tentatives
      setError('Access denied. Only administrator credentials are allowed.');
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Card
        elevation={10}
        sx={{
          maxWidth: 450,
          width: '100%',
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Security sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Admin Portal
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Farmer Cooperative Management System
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> All email/password combinations are accepted except default credentials.
              </Typography>
            </Alert>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={requires2FA}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                )
              }}
            />

            {!requires2FA && (
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )}

            {show2FA && (
              <TextField
                fullWidth
                label="Two-Factor Authentication Code"
                name="twoFactorCode"
                value={formData.twoFactorCode}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                placeholder="Enter 6-digit code"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  )
                }}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : requires2FA ? (
                'Verify Code'
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {show2FA && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Enter the 6-digit code from your authenticator app
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setShow2FA(false);
                  setRequires2FA(false);
                  setFormData({ ...formData, password: '', twoFactorCode: '' });
                }}
                sx={{ mt: 1 }}
              >
                Back to login
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
