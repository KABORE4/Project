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
  Grass, 
  Add, 
  Edit, 
  Delete, 
  Person, 
  Nature,
  Scale,
  CalendarToday,
  Star,
  TrendingUp,
  Agriculture
} from '@mui/icons-material';
import DataTable from '../components/DataTable';
import HarvestForm from '../components/HarvestForm';
import { getHarvests, deleteHarvest } from '../services/harvestService';

const HarvestsList = () => {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingHarvest, setEditingHarvest] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { 
      field: 'harvestCode', 
      headerName: 'Harvest Code', 
      width: 130,
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
      field: 'plotId', 
      headerName: 'Plot ID', 
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Nature sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'crop', 
      headerName: 'Crop', 
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="success" 
          variant="outlined"
        />
      )
    },
    { 
      field: 'weight', 
      headerName: 'Weight', 
      width: 100, 
      type: 'number',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Scale sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{parseFloat(params.value) || 0} {params.row.unit || 'kg'}</Typography>
        </Box>
      )
    },
    { 
      field: 'harvestDate', 
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
    { 
      field: 'quality', 
      headerName: 'Quality', 
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Star sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Chip 
            label={params.value} 
            size="small" 
            color={params.value === 'Premium' ? 'warning' : 'default'}
            variant="outlined"
          />
        </Box>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 100, 
      type: 'status',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color={params.value === 'completed' ? 'success' : 'default'}
        />
      )
    },
  ];

  const fetchHarvests = async () => {
    try {
      setLoading(true);
      const data = await getHarvests();
      setHarvests(data);
    } catch (error) {
      console.error('Error fetching harvests:', error);
      setSnackbar({ open: true, message: 'Error loading harvests', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHarvests();
  }, []);

  const handleAdd = () => {
    setEditingHarvest(null);
    setOpenForm(true);
  };

  const handleEdit = (harvest) => {
    setEditingHarvest(harvest);
    setOpenForm(true);
  };

  const handleDelete = async (harvest) => {
    if (window.confirm(`Are you sure you want to delete harvest ${harvest.harvestCode}?`)) {
      try {
        await deleteHarvest(harvest._id);
        setSnackbar({ open: true, message: 'Harvest deleted successfully', severity: 'success' });
        fetchHarvests();
      } catch (error) {
        console.error('Error deleting harvest:', error);
        setSnackbar({ open: true, message: 'Error deleting harvest', severity: 'error' });
      }
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingHarvest(null);
  };

  const handleFormSuccess = () => {
    setSnackbar({
      open: true,
      message: editingHarvest ? 'Harvest updated successfully' : 'Harvest added successfully',
      severity: 'success'
    });
    handleFormClose();
    
    // Force refetch with a small delay to ensure backend has processed the data
    setTimeout(() => {
      console.log('Force refetching harvests after save...');
      fetchHarvests();
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
            Harvests Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Track and manage all crop harvests and yields
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {harvests.length}
                    </Typography>
                    <Typography variant="body2">
                      Total Harvests
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {harvests.reduce((sum, h) => sum + (parseFloat(h.weight) || 0), 0).toFixed(1)}
                    </Typography>
                    <Typography variant="body2">
                      Total Weight
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Scale />
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
                      {[...new Set(harvests.map(h => h.crop))].length}
                    </Typography>
                    <Typography variant="body2">
                      Crop Types
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
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {harvests.filter(h => h.quality === 'Premium').length}
                    </Typography>
                    <Typography variant="body2">
                      Premium Quality
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Star />
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
              background: 'linear-gradient(45deg, #4facfe 30%, #00f2fe 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #3d9bfc 30%, #00d9ee 90%)',
              }
            }}
          >
            Record New Harvest
          </Button>
        </Box>

        {/* Data Table */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <DataTable
            data={harvests}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Paper>

        {/* Form Dialog */}
        <Dialog open={openForm} onClose={handleFormClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingHarvest ? 'Edit Harvest' : 'Record New Harvest'}
          </DialogTitle>
          <DialogContent>
            <HarvestForm
              harvest={editingHarvest}
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

export default HarvestsList;
