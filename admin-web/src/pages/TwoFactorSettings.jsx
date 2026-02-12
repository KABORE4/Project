import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import { 
  Security, 
  Phone, 
  QrCodeScanner,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { enable2FA, disable2FA, get2FAStatus } from '../services/authService';

const TwoFactorSettings = ({ token }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [setupData, setSetupData] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [showSetupDialog, setShowSetupDialog] = useState(false);

  useEffect(() => {
    fetch2FAStatus();
  }, [token]);

  const fetch2FAStatus = async () => {
    try {
      const response = await get2FAStatus(token);
      setIsEnabled(response.enabled);
    } catch (err) {
      console.error('Error fetching 2FA status:', err);
    }
  };

  const handleEnable2FA = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await enable2FA(token);
      setSetupData(response);
      setShowSetupDialog(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await disable2FA(token);
      setIsEnabled(false);
      setSuccess('Two-factor authentication has been disabled');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // This would be an API call to verify and complete setup
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEnabled(true);
      setShowSetupDialog(false);
      setSetupData(null);
      setVerificationCode('');
      setSuccess('Two-factor authentication has been enabled');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Security Settings
      </Typography>
      
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Manage your account security settings and two-factor authentication.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Security sx={{ fontSize: 32, color: '#667eea', mr: 2 }} />
            <Typography variant="h5" fontWeight="bold">
              Two-Factor Authentication
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              Add an extra layer of security to your account by enabling two-factor authentication.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              When enabled, you'll need to enter a code from your authenticator app in addition to your password.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Status: {isEnabled ? 'Enabled' : 'Disabled'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {isEnabled 
                  ? 'Your account is protected with 2FA'
                  : 'Your account is not protected with 2FA'
                }
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={isEnabled}
                  onChange={isEnabled ? handleDisable2FA : handleEnable2FA}
                  disabled={loading}
                  color="primary"
                />
              }
              label=""
            />
          </Box>

          {!isEnabled && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Security Recommendation
                </Typography>
              </Box>
              <Typography variant="body2">
                We strongly recommend enabling two-factor authentication to protect your admin account from unauthorized access.
              </Typography>
            </Box>
          )}

          {isEnabled && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Account Protected
                </Typography>
              </Box>
              <Typography variant="body2">
                Your account is protected with two-factor authentication. Make sure to keep your authenticator app secure.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Setup Dialog */}
      <Dialog open={showSetupDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <QrCodeScanner sx={{ mr: 1, color: '#667eea' }} />
            Setup Two-Factor Authentication
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            {/* QR Code would be generated here */}
            <Box 
              sx={{ 
                width: 200, 
                height: 200, 
                border: '2px dashed #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
            >
              <QrCodeScanner sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
              <Typography variant="body2" color="textSecondary">
                QR Code Placeholder
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="textSecondary" gutterBottom>
            Or enter this code manually in your app:
          </Typography>
          
          <Box sx={{ 
            p: 2, 
            bgcolor: 'grey.100', 
            borderRadius: 1, 
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '1.2rem'
          }}>
            {setupData?.secret || 'ABCD-EFGH-IJKL-MNOP'}
          </Box>

          <TextField
            fullWidth
            label="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter 6-digit code"
            sx={{ mt: 3 }}
            InputProps={{
              startAdornment: <Phone color="action" />
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSetupDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleVerifySetup}
            variant="contained"
            disabled={loading || !verificationCode}
          >
            {loading ? <CircularProgress size={20} /> : 'Enable 2FA'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TwoFactorSettings;
