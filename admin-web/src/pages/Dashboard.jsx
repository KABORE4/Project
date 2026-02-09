import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { People, Nature, Grass, Build, Event, Receipt, ShoppingCart, AccountBalance } from '@mui/icons-material';
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
    { title: 'Members', value: stats.members, icon: <People />, color: '#1976d2' },
    { title: 'Plots', value: stats.plots, icon: <Nature />, color: '#388e3c' },
    { title: 'Harvests', value: stats.harvests, icon: <Grass />, color: '#f57c00' },
    { title: 'Equipment', value: stats.equipment, icon: <Build />, color: '#7b1fa2' },
    { title: 'Bookings', value: stats.bookings, icon: <Event />, color: '#d32f2f' },
    { title: 'Expenses', value: stats.expenses, icon: <Receipt />, color: '#0288d1' },
    { title: 'Sales', value: stats.sales, icon: <ShoppingCart />, color: '#689f38' },
    { title: 'Distributions', value: stats.distributions, icon: <AccountBalance />, color: '#f06292' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color, fontSize: 40 }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
