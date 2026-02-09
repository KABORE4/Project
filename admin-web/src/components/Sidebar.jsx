import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import {
  Dashboard,
  People,
  Nature,
  Grass,
  Build,
  Event,
  Receipt,
  ShoppingCart,
  AccountBalance
} from '@mui/icons-material';

const drawerWidth = 240;

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

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
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
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
