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
  Nature, 
  Add, 
  Edit, 
  Delete, 
  LocationOn, 
  Agriculture,
  WaterDrop,
  Grass,
  TrendingUp,
  Person
} from '@mui/icons-material';
import DataTable from '../components/DataTable';
import PlotForm from '../components/PlotForm';
import { getPlots, deletePlot } from '../services/plotService';

const PlotsList = () => {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { 
      field: 'plotCode', 
      headerName: 'Plot Code', 
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
      field: 'memberId', 
      headerName: 'Member ID', 
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Person sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'size', 
      headerName: 'Size (ha)', 
      width: 100, 
      type: 'number',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Agriculture sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{parseFloat(params.value) || 0} ha</Typography>
        </Box>
      )
    },
    { 
      field: 'location.village', 
      headerName: 'Village', 
      width: 120, 
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOn sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value || 'N/A'}</Typography>
        </Box>
      )
    },
    { 
      field: 'soilType', 
      headerName: 'Soil Type', 
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="outlined"
        />
      )
    },
    { 
      field: 'waterAccess', 
      headerName: 'Water Access', 
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WaterDrop sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'crops', 
      headerName: 'Crops', 
      width: 150, 
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Grass sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">
            {Array.isArray(params.value) ? params.value.join(', ') : params.value}
          </Typography>
        </Box>
      )
    },
  ];

  const fetchPlots = async () => {
    try {
      setLoading(true);
      const data = await getPlots();
      setPlots(data);
    } catch (error) {
      console.error('Error fetching plots:', error);
      setSnackbar({ open: true, message: 'Error loading plots', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  const handleAdd = () => {
    setEditingPlot(null);
    setOpenForm(true);
  };

  const handleEdit = (plot) => {
    setEditingPlot(plot);
    setOpenForm(true);
  };

  const handleDelete = async (plot) => {
    if (window.confirm(`Are you sure you want to delete plot ${plot.plotCode}?`)) {
      try {
        await deletePlot(plot._id);
        setSnackbar({ open: true, message: 'Plot deleted successfully', severity: 'success' });
        fetchPlots();
      } catch (error) {
        console.error('Error deleting plot:', error);
        setSnackbar({ open: true, message: 'Error deleting plot', severity: 'error' });
      }
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingPlot(null);
  };

  const handleFormSuccess = () => {
    setSnackbar({
      open: true,
      message: editingPlot ? 'Plot updated successfully' : 'Plot added successfully',
      severity: 'success'
    });
    handleFormClose();
    
    // Force refetch with a small delay to ensure backend has processed the data
    setTimeout(() => {
      console.log('Force refetching plots after save...');
      fetchPlots();
    }, 500);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Fade in>
      <Container maxWidth="xl" sx={{ py: 2, overflow: 'hidden', width: '100%', maxWidth: '100vw' }}>
        {/* Header Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Plots Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage all agricultural plots and land information
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {plots.length}
                    </Typography>
                    <Typography variant="body2">
                      Total Plots
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Nature />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {plots.reduce((sum, p) => sum + (parseFloat(p.size) || 0), 0).toFixed(1)}
                    </Typography>
                    <Typography variant="body2">
                      Total Hectares
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Agriculture />
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
                      {[...new Set(plots.map(p => p.soilType))].length}
                    </Typography>
                    <Typography variant="body2">
                      Soil Types
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Grass />
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
                      {plots.filter(p => p.waterAccess === 'yes').length}
                    </Typography>
                    <Typography variant="body2">
                      Water Access
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <WaterDrop />
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
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
              }
            }}
          >
            Add New Plot
          </Button>
        </Box>

        {/* Data Table */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <DataTable
            data={plots}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Paper>

        {/* Form Dialog */}
        <Dialog open={openForm} onClose={handleFormClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingPlot ? 'Edit Plot' : 'Add New Plot'}
          </DialogTitle>
          <DialogContent>
            <PlotForm
              plot={editingPlot}
              onSuccess={handleFormSuccess}
              onCancel={handleFormClose}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFormClose}>Cancel</Button>
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

export default PlotsList;
