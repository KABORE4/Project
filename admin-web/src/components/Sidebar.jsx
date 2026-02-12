import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider, Box, IconButton } from '@mui/material';
import {
  Dashboard,
  People,
  Nature,
  Grass,
  Build,
  Event,
  Receipt,
  ShoppingCart,
  AccountBalance,
  Security,
  Logout
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = '20vw';

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Members', icon: <People />, path: '/members' },
  { text: 'Plots', icon: <Nature />, path: '/plots' },
  { text: 'Harvests', icon: <Grass />, path: '/harvests' },
  { text: 'Equipment', icon: <Build />, path: '/equipment' },
  { text: 'Bookings', icon: <Event />, path: '/bookings' },
  { text: 'Expenses', icon: <Receipt />, path: '/expenses' },
  { text: 'Sales', icon: <ShoppingCart />, path: '/sales' },
  { text: 'Distributions', icon: <AccountBalance />, path: '/distributions' },
];

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #64b5f6 0%, #3b82f6 100%)',
          borderRight: '1px solid #3b82f6',
        },
      }}
    >
      <Toolbar sx={{ 
          background: 'rgba(255,255,255,0.1)',
          borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}>
          Farmer Coop Admin
        </Typography>
      </Toolbar>
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.3)' }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/security"
            selected={location.pathname === '/security'}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <Security />
            </ListItemIcon>
            <ListItemText primary="Security" sx={{ color: 'white' }} />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />
      
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.3)' }}>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }} gutterBottom>
            Logged in as:
          </Typography>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'white' }}>
            {user?.name || 'Admin User'}
          </Typography>
        </Box>
        
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton onClick={handleLogout} sx={{ 
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: 'white' }} />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
