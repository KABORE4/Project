import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';
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

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Farmer Cooperative Management System
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: '240px', // Adjust based on sidebar width
          marginTop: '64px', // Adjust based on app bar height
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
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
