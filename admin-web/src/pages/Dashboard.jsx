import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box, Paper, Avatar, LinearProgress, Button, Chip, Container } from '@mui/material';
import { 
  People, 
  Add, 
  Edit, 
  Delete, 
  Receipt, 
  AttachMoney, 
  CalendarToday, 
  TrendingUp,
  PieChart,
  Person,
  Group,
  Settings,
  AccountBalance,
  ShoppingCart,
  Description,
  Build,
  Grass,
  Scale,
  Event,
  Schedule,
  Nature
} from '@mui/icons-material';
import { getMembers } from '../services/memberService';
import { getPlots } from '../services/plotService';
import { getHarvests } from '../services/harvestService';
import { getEquipment } from '../services/equipmentService';
import { getBookings } from '../services/bookingService';
import { getExpenses } from '../services/expenseService';
import { getSales } from '../services/saleService';
import { getDistributions } from '../services/distributionService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    members: [],
    plots: [],
    harvests: [],
    equipment: [],
    bookings: [],
    expenses: [],
    sales: [],
    distributions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      
      // Try to get data from backend first
      let membersData = null;
      let plotsData = null;
      let harvestsData = null;
      let equipmentData = null;
      let bookingsData = null;
      let expensesData = null;
      let salesData = null;
      let distributionsData = null;

      try {
        membersData = await getMembers();
      } catch (error) {
        console.error('Error fetching members:', error);
      }

      try {
        plotsData = await getPlots();
      } catch (error) {
        console.error('Error fetching plots:', error);
      }

      try {
        harvestsData = await getHarvests();
      } catch (error) {
        console.error('Error fetching harvests:', error);
      }

      try {
        equipmentData = await getEquipment();
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }

      try {
        bookingsData = await getBookings();
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }

      try {
        expensesData = await getExpenses();
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }

      try {
        salesData = await getSales();
      } catch (error) {
        console.error('Error fetching sales:', error);
      }

      try {
        distributionsData = await getDistributions();
      } catch (error) {
        console.error('Error fetching distributions:', error);
      }

      console.log('Raw data received:', {
        membersData,
        plotsData,
        harvestsData,
        equipmentData,
        bookingsData,
        expensesData,
        salesData,
        distributionsData
      });

      // Create clean data objects to avoid XrayWrapper issues
      const cleanData = {
        members: [],
        plots: [],
        harvests: [],
        equipment: [],
        bookings: [],
        expenses: [],
        sales: [],
        distributions: []
      };

      // Safely copy data if valid
      if (membersData && Array.isArray(membersData)) {
        cleanData.members = JSON.parse(JSON.stringify(membersData));
      } else {
        cleanData.members = [];
      }
      if (plotsData && Array.isArray(plotsData)) {
        cleanData.plots = JSON.parse(JSON.stringify(plotsData));
      } else {
        cleanData.plots = [];
      }
      if (harvestsData && Array.isArray(harvestsData)) {
        cleanData.harvests = JSON.parse(JSON.stringify(harvestsData));
      } else {
        cleanData.harvests = [];
      }
      if (equipmentData && Array.isArray(equipmentData)) {
        cleanData.equipment = JSON.parse(JSON.stringify(equipmentData));
      } else {
        cleanData.equipment = [];
      }
      if (bookingsData && Array.isArray(bookingsData)) {
        cleanData.bookings = JSON.parse(JSON.stringify(bookingsData));
      } else {
        cleanData.bookings = [];
      }
      if (expensesData && Array.isArray(expensesData)) {
        cleanData.expenses = JSON.parse(JSON.stringify(expensesData));
      } else {
        cleanData.expenses = [];
      }
      if (salesData && Array.isArray(salesData)) {
        cleanData.sales = JSON.parse(JSON.stringify(salesData));
      } else {
        cleanData.sales = [];
      }
      if (distributionsData && Array.isArray(distributionsData)) {
        cleanData.distributions = JSON.parse(JSON.stringify(distributionsData));
      } else {
        cleanData.distributions = [];
      }

      console.log('Setting dashboard data:', cleanData);
      setData(cleanData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Only use mock data as last resort
      setData({
        members: [
          { _id: '1', name: 'John Doe', role: 'member', plotSize: '5.5' },
          { _id: '2', name: 'Jane Smith', role: 'member', plotSize: '3.2' },
          { _id: '3', name: 'Bob Johnson', role: 'admin', plotSize: '7.8' }
        ],
        plots: [
          { _id: '1', plotCode: 'P001', memberId: '1', size: '5.5', location: { village: 'North Village' }, soilType: 'Clay' },
          { _id: '2', plotCode: 'P002', memberId: '2', size: '3.2', location: { village: 'South Village' }, soilType: 'Loam' }
        ],
        harvests: [
          { _id: '1', harvestCode: 'H001', memberId: '1', plotId: '1', crop: 'Corn', weight: '500', harvestDate: '2024-01-15', quality: 'Premium' },
          { _id: '2', harvestCode: 'H002', memberId: '2', plotId: '2', crop: 'Wheat', weight: '300', harvestDate: '2024-01-10', quality: 'Standard' }
        ],
        equipment: [
          { _id: '1', equipmentCode: 'E001', name: 'Tractor', type: 'Machinery', rentalRate: '50', rentalUnit: 'day', status: 'available' },
          { _id: '2', equipmentCode: 'E002', name: 'Plow', type: 'Tool', rentalRate: '25', rentalUnit: 'day', status: 'available' }
        ],
        bookings: [
          { _id: '1', bookingCode: 'B001', memberId: '1', equipmentId: '1', startDate: '2024-01-20', endDate: '2024-01-25', purpose: 'Land preparation', status: 'active' }
        ],
        expenses: [
          { _id: '1', expenseCode: 'EX001', category: 'Seeds', description: 'Corn seeds for spring', amount: '150', paidBy: 'Farm Coop', expenseDate: '2024-01-05' },
          { _id: '2', expenseCode: 'EX002', category: 'Fertilizer', description: 'Organic fertilizer', amount: '200', paidBy: 'Farm Coop', expenseDate: '2024-01-10' }
        ],
        sales: [
          { _id: '1', saleCode: 'S001', crop: 'Corn', totalWeight: '500', buyerName: 'Local Market', unitPrice: '0.80', saleDate: '2024-01-16', totalRevenue: '400' },
          { _id: '2', saleCode: 'S002', crop: 'Wheat', totalWeight: '300', buyerName: 'City Market', unitPrice: '0.90', saleDate: '2024-01-12', totalRevenue: '270' }
        ],
        distributions: [
          { _id: '1', distributionCode: 'D001', saleId: 'S001', totalRevenue: '400', cooperativeShare: '0.15', distributionDate: '2024-01-20' },
          { _id: '2', distributionCode: 'D002', saleId: 'S002', totalRevenue: '270', cooperativeShare: '0.20', distributionDate: '2024-01-18' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Members',
      value: data.members && data.members.length ? data.members.length : 0,
      icon: <People />,
      color: '#667eea',
      trend: '+12%',
      subtitle: 'Active farmers'
    },
    {
      title: 'Total Plots',
      value: data.plots && data.plots.length ? data.plots.length : 0,
      icon: <Nature />,
      color: '#f093fb',
      trend: '+8%',
      subtitle: 'Land parcels'
    },
    {
      title: 'Total Harvests',
      value: data.harvests && data.harvests.length ? data.harvests.length : 0,
      icon: <Grass />,
      color: '#4facfe',
      trend: '+15%',
      subtitle: 'Crop yields'
    },
    {
      title: 'Equipment',
      value: data.equipment && data.equipment.length ? data.equipment.length : 0,
      icon: <Build />,
      color: '#fa709a',
      trend: '+5%',
      subtitle: 'Tools & machines'
    }
  ];

  const financialStats = [
    {
      title: 'Total Revenue',
      value: data.sales && data.sales.length ? `$${data.sales.reduce((sum, sale) => sum + (parseFloat(sale.totalRevenue) || 0), 0).toFixed(2)}` : '$0.00',
      icon: <TrendingUp />,
      color: '#00b894',
      progress: 75
    },
    {
      title: 'Total Expenses',
      value: data.expenses && data.expenses.length ? `$${data.expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0).toFixed(2)}` : '$0.00',
      icon: <Receipt />,
      color: '#e17055',
      progress: 45
    },
    {
      title: 'Active Bookings',
      value: data.bookings && data.bookings.length ? data.bookings.filter(b => b.status === 'active').length : 0,
      icon: <Event />,
      color: '#0984e3',
      progress: 60
    },
    {
      title: 'Distributions',
      value: data.distributions && data.distributions.length ? data.distributions.length : 0,
      icon: <AccountBalance />,
      color: '#6c5ce7',
      progress: 80
    }
  ];

  const quickActions = [
    { title: 'Add Member', icon: <People />, color: '#667eea', path: '/members' },
    { title: 'Add Plot', icon: <Nature />, color: '#f093fb', path: '/plots' },
    { title: 'Record Harvest', icon: <Grass />, color: '#4facfe', path: '/harvests' },
    { title: 'Add Equipment', icon: <Build />, color: '#fa709a', path: '/equipment' },
    { title: 'Add Expense', icon: <Receipt />, color: '#e17055', path: '/expenses' },
    { title: 'Record Sale', icon: <ShoppingCart />, color: '#00b894', path: '/sales' },
    { title: 'Manage Bookings', icon: <Event />, color: '#0984e3', path: '/bookings' },
    { title: 'View Distributions', icon: <AccountBalance />, color: '#6c5ce7', path: '/distributions' }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 1, overflow: 'hidden', width: '100%', maxWidth: '100vw' }}>
      {/* Header Section */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          🌾 Farm Management Dashboard
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Real-time overview of your agricultural operations
        </Typography>
      </Box>

      {/* Main Stats Grid */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card sx={{ 
              background: `linear-gradient(135deg, ${stat.color}22 0%, ${stat.color}11 100%)`,
              border: `2px solid ${stat.color}44`,
              borderRadius: 3,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ padding: '8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, color: 'white' }}>
                    {stat.icon}
                  </Avatar>
                  <Chip 
                    label={stat.trend} 
                    size="small" 
                    color="success" 
                    variant="outlined"
                  />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="textPrimary">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                  {stat.title}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Financial Stats */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {financialStats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ padding: '8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, color: 'white', mr: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stat.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#E0E0E0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: stat.color,
                      borderRadius: 4
                    }
                  }}
                />
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                  {stat.progress}% of target
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <CardContent sx={{ padding: '8px' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={1}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={action.title}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={action.icon}
                  onClick={() => navigate(action.path)}
                  sx={{
                    p: 1,
                    height: 60,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}dd 100%)`,
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                      background: `linear-gradient(135deg, ${action.color}dd 0%, ${action.color} 100%)`,
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {action.icon}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {action.title}
                    </Typography>
                  </Box>
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
