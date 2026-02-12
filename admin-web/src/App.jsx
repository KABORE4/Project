import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MembersList from './pages/MembersList';
import PlotsList from './pages/PlotsList';
import HarvestsList from './pages/HarvestsList';
import EquipmentList from './pages/EquipmentList';
import BookingsList from './pages/BookingsList';
import ExpensesList from './pages/ExpensesList';
import SalesList from './pages/SalesList';
import DistributionsList from './pages/DistributionsList';
import Login from './pages/Login';
import TwoFactorSettings from './pages/TwoFactorSettings';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AuthenticatedApp = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #64b5f6 0%, #3b82f6 100%)',
        borderBottom: '1px solid rgba(59,130,246,0.3)'
      }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}>
            Farmer Cooperative Management System
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar />
      <Box
        component="main"
        sx={{
          width: '80vw',
          p: 1,
          marginTop: '64px',
          overflow: 'hidden'
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<MembersList />} />
          <Route path="/plots" element={<PlotsList />} />
          <Route path="/harvests" element={<HarvestsList />} />
          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/bookings" element={<BookingsList />} />
          <Route path="/expenses" element={<ExpensesList />} />
          <Route path="/sales" element={<SalesList />} />
          <Route path="/distributions" element={<DistributionsList />} />
          <Route path="/security" element={<TwoFactorSettings />} />
        </Routes>
      </Box>
    </Box>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        } 
      />
      <Route path="/*" element={
        <ProtectedRoute>
          <AuthenticatedApp />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
