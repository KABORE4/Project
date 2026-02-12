import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Snackbar, 
  Alert,
  Avatar,
  Fade,
  Chip
} from '@mui/material';
import { 
  AccountBalance, 
  Add, 
  Edit, 
  Delete, 
  Receipt, 
  AttachMoney, 
  CalendarToday,
  TrendingUp,
  PieChart,
  People
} from '@mui/icons-material';
import DataTable from '../components/DataTable';
import DistributionForm from '../components/DistributionForm';
import { getDistributions, createDistribution, updateDistribution, deleteDistribution } from '../services/distributionService';

const DistributionsList = () => {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingDistribution, setEditingDistribution] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { 
      field: 'distributionCode', 
      headerName: 'Code', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      )
    },
    { 
      field: 'saleId', 
      headerName: 'Sale ID', 
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Receipt sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'totalRevenue', 
      headerName: 'Revenue', 
      width: 120, 
      type: 'currency',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AttachMoney sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2" fontWeight="bold" color="success.main">
            ${parseFloat(params.value) || 0}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'cooperativeShare', 
      headerName: 'Coop Share', 
      width: 120, 
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PieChart sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">
            {parseFloat(params.value) ? `${(parseFloat(params.value) * 100).toFixed(1)}%` : '0%'}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'distributionDate', 
      headerName: 'Date', 
      width: 120, 
      type: 'date',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarToday sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
  ];

  useEffect(() => {
    fetchDistributions();
  }, []);

  const fetchDistributions = async () => {
    try {
      setLoading(true);
      const data = await getDistributions();
      setDistributions(data);
    } catch (error) {
      console.error('Error fetching distributions:', error);
      setSnackbar({ open: true, message: 'Error loading distributions', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDistribution(null);
    setOpen(true);
  };

  const handleEdit = (distribution) => {
    setEditingDistribution(distribution);
    setOpen(true);
  };

  const handleDelete = async (distribution) => {
    if (window.confirm('Are you sure you want to delete this distribution?')) {
      try {
        await deleteDistribution(distribution._id);
        setSnackbar({ open: true, message: 'Distribution deleted successfully', severity: 'success' });
        fetchDistributions();
      } catch (error) {
        console.error('Error deleting distribution:', error);
        setSnackbar({ open: true, message: 'Error deleting distribution', severity: 'error' });
      }
    }
  };

  const handleSave = async (distributionData) => {
    try {
      if (editingDistribution) {
        await updateDistribution(editingDistribution._id, distributionData);
        setSnackbar({ open: true, message: 'Distribution updated successfully', severity: 'success' });
      } else {
        await createDistribution(distributionData);
        setSnackbar({ open: true, message: 'Distribution created successfully', severity: 'success' });
      }
      setOpen(false);
      // Force refetch with a small delay to ensure backend has processed the data
      setTimeout(() => {
        console.log('Force refetching distributions after save...');
        fetchDistributions();
      }, 500);
    } catch (error) {
      console.error('Error saving distribution:', error);
      setSnackbar({ open: true, message: 'Error saving distribution', severity: 'error' });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingDistribution(null);
  };

  return (
    <Fade in>
      <Container maxWidth="xl" sx={{ py: 2, overflow: 'hidden', width: '100%', maxWidth: '100vw' }}>
        {/* Header Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Profit Distributions
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage profit sharing and member distributions
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #6c5ce7 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {distributions.length}
                    </Typography>
                    <Typography variant="body2">
                      Total Distributions
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <AccountBalance />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #00b894 0%, #00a074 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      ${distributions.reduce((sum, d) => sum + (parseFloat(d.totalRevenue) || 0), 0).toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Total Distributed
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <TrendingUp />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {distributions.length > 0 ? (distributions.reduce((sum, d) => sum + (parseFloat(d.totalRevenue) || 0), 0) / distributions.length).toFixed(2) : '0.00'}
                    </Typography>
                    <Typography variant="body2">
                      Average Distribution
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <PieChart />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {distributions.length > 0 ? (distributions.reduce((sum, d) => sum + (parseFloat(d.cooperativeShare) || 0), 0) / distributions.length).toFixed(1) : '0'}%
                    </Typography>
                    <Typography variant="body2">
                      Avg. Coop Share
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <People />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{
              background: 'linear-gradient(45deg, #6c5ce7 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a4fc7 30%, #6b46c1 90%)',
              }
            }}
          >
            New Distribution
          </Button>
        </Box>

        {/* Data Table */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <DataTable
            data={distributions}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Paper>

        {/* Form Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingDistribution ? 'Edit Distribution' : 'New Distribution'}
          </DialogTitle>
          <DialogContent>
            <DistributionForm
              distribution={editingDistribution}
              onSave={handleSave}
              onCancel={handleClose}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Fade>
  );
};

export default DistributionsList;
