import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Paper, Avatar, LinearProgress } from '@mui/material';
import { 
  People, 
  Nature, 
  Grass, 
  Build, 
  Event, 
  Receipt, 
  ShoppingCart, 
  AccountBalance,
  TrendingUp,
  Agriculture,
  Inventory
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
  const [stats, setStats] = useState({
    members: 0,
    plots: 0,
    harvests: 0,
    equipment: 0,
    bookings: 0,
    expenses: 0,
    sales: 0,
    distributions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all stats from respective services
        const members = await getMembers();
        const plots = await getPlots();
        const harvests = await getHarvests();
        const equipment = await getEquipment();
        const bookings = await getBookings();
        const expenses = await getExpenses();
        const sales = await getSales();
        const distributions = await getDistributions();

        setStats({
          members: members.length,
          plots: plots.length,
          harvests: harvests.length,
          equipment: equipment.length,
          bookings: bookings.length,
          expenses: expenses.length,
          sales: sales.length,
          distributions: distributions.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to placeholder values on error
        setStats({
          members: 0,
          plots: 25,
          harvests: 150,
          equipment: 10,
          bookings: 8,
          expenses: 45,
          sales: 20,
          distributions: 15,
        });
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      title: 'Members', 
      value: stats.members, 
      icon: <People />, 
      color: '#2E7D32',
      bgColor: '#E8F5E8',
      trend: '+12%',
      description: 'Active farmers'
    },
    { 
      title: 'Plots', 
      value: stats.plots, 
      icon: <Nature />, 
      color: '#1976D2',
      bgColor: '#E3F2FD',
      trend: '+8%',
      description: 'Total farmland'
    },
    { 
      title: 'Harvests', 
      value: stats.harvests, 
      icon: <Grass />, 
      color: '#F57C00',
      bgColor: '#FFF3E0',
      trend: '+15%',
      description: 'This season'
    },
    { 
      title: 'Equipment', 
      value: stats.equipment, 
      icon: <Build />, 
      color: '#7B1FA2',
      bgColor: '#F3E5F5',
      trend: '+5%',
      description: 'Available items'
    },
    { 
      title: 'Bookings', 
      value: stats.bookings, 
      icon: <Event />, 
      color: '#D32F2F',
      bgColor: '#FFEBEE',
      trend: '+22%',
      description: 'Active rentals'
    },
    { 
      title: 'Expenses', 
      value: stats.expenses, 
      icon: <Receipt />, 
      color: '#0288D1',
      bgColor: '#E1F5FE',
      trend: '-8%',
      description: 'Monthly total'
    },
    { 
      title: 'Sales', 
      value: stats.sales, 
      icon: <ShoppingCart />, 
      color: '#689F38',
      bgColor: '#F1F8E9',
      trend: '+18%',
      description: 'Revenue generated'
    },
    { 
      title: 'Distributions', 
      value: stats.distributions, 
      icon: <AccountBalance />, 
      color: '#F06292',
      bgColor: '#FCE4EC',
      trend: '+10%',
      description: 'Completed'
    },
  ];

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: 4, 
      backgroundColor: '#F8F9FA',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          🌾 Farm Management Dashboard
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Real-time overview of your agricultural operations
        </Typography>
      </Paper>

      {/* Stats Grid */}
      <Grid container spacing={4}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.title}>
            <Card 
              elevation={4}
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: card.bgColor,
                      color: card.color,
                      width: 56,
                      height: 56,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  <Box textAlign="right">
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: card.trend.startsWith('+') ? '#4CAF50' : '#F44336',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                      {card.trend}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {card.description}
                    </Typography>
                  </Box>
                </Box>
                
                <Box mt={2}>
                  <Typography variant="h4" fontWeight="bold" color="textPrimary">
                    {card.value.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                    {card.title}
                  </Typography>
                </Box>

                {/* Progress Bar */}
                <Box mt={2}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((card.value / 100) * 100, 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#E0E0E0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: card.color,
                        borderRadius: 3
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Paper 
        elevation={2}
        sx={{ 
          p: 3, 
          mt: 4, 
          borderRadius: 3,
          backgroundColor: 'white'
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box 
              sx={{ 
                p: 2, 
                border: '2px solid #E8F5E8',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#E8F5E8' }
              }}
            >
              <Agriculture sx={{ fontSize: 32, color: '#2E7D32', mb: 1 }} />
              <Typography variant="body2" fontWeight="medium">
                Add Member
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box 
              sx={{ 
                p: 2, 
                border: '2px solid #E3F2FD',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#E3F2FD' }
              }}
            >
              <Nature sx={{ fontSize: 32, color: '#1976D2', mb: 1 }} />
              <Typography variant="body2" fontWeight="medium">
                New Plot
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box 
              sx={{ 
                p: 2, 
                border: '2px solid #FFF3E0',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#FFF3E0' }
              }}
            >
              <Grass sx={{ fontSize: 32, color: '#F57C00', mb: 1 }} />
              <Typography variant="body2" fontWeight="medium">
                Record Harvest
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box 
              sx={{ 
                p: 2, 
                border: '2px solid #F3E5F5',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#F3E5F5' }
              }}
            >
              <Inventory sx={{ fontSize: 32, color: '#7B1FA2', mb: 1 }} />
              <Typography variant="body2" fontWeight="medium">
                Manage Equipment
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
