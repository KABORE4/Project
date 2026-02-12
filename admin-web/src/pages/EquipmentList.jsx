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
  Build, 
  Add, 
  Edit, 
  Delete, 
  AttachMoney, 
  Category,
  TrendingUp,
  Inventory,
  Settings
} from '@mui/icons-material';
import DataTable from '../components/DataTable';
import EquipmentForm from '../components/EquipmentForm';
import { getEquipment, createEquipment, updateEquipment, deleteEquipment } from '../services/equipmentService';

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { 
      field: 'equipmentCode', 
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
      field: 'name', 
      headerName: 'Name', 
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Settings sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="info" 
          variant="outlined"
        />
      )
    },
    { 
      field: 'rentalRate', 
      headerName: 'Rate', 
      width: 100, 
      type: 'currency',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AttachMoney sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">${parseFloat(params.value) || 0}</Typography>
        </Box>
      )
    },
    { 
      field: 'rentalUnit', 
      headerName: 'Unit', 
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Category sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
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
          color={params.value === 'available' ? 'success' : 'default'}
        />
      )
    },
  ];

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const data = await getEquipment();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setSnackbar({ open: true, message: 'Error loading equipment', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingEquipment(null);
    setOpen(true);
  };

  const handleEdit = (equipment) => {
    setEditingEquipment(equipment);
    setOpen(true);
  };

  const handleDelete = async (equipment) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await deleteEquipment(equipment._id);
        setSnackbar({ open: true, message: 'Equipment deleted successfully', severity: 'success' });
        fetchEquipment();
      } catch (error) {
        console.error('Error deleting equipment:', error);
        setSnackbar({ open: true, message: 'Error deleting equipment', severity: 'error' });
      }
    }
  };

  const handleSave = async (equipmentData) => {
    try {
      if (editingEquipment) {
        await updateEquipment(editingEquipment._id, equipmentData);
        setSnackbar({ open: true, message: 'Equipment updated successfully', severity: 'success' });
      } else {
        await createEquipment(equipmentData);
        setSnackbar({ open: true, message: 'Equipment created successfully', severity: 'success' });
      }
      setOpen(false);
      // Force refetch with a small delay to ensure backend has processed the data
      setTimeout(() => {
        console.log('Force refetching equipment after save...');
        fetchEquipment();
      }, 500);
    } catch (error) {
      console.error('Error saving equipment:', error);
      setSnackbar({ open: true, message: 'Error saving equipment', severity: 'error' });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEquipment(null);
  };

  return (
    <Fade in>
      <Container maxWidth="xl" sx={{ py: 2, overflow: 'hidden', width: '100%', maxWidth: '100vw' }}>
        {/* Header Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Equipment Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage all agricultural equipment and tools
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {equipment.length}
                    </Typography>
                    <Typography variant="body2">
                      Total Equipment
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Build />
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
                      {equipment.filter(e => e.status === 'available').length}
                    </Typography>
                    <Typography variant="body2">
                      Available
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Inventory />
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
                      {[...new Set(equipment.map(e => e.type))].length}
                    </Typography>
                    <Typography variant="body2">
                      Equipment Types
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Category />
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
                      ${equipment.reduce((sum, e) => sum + (parseFloat(e.rentalRate) || 0), 0).toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Avg. Rate
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <AttachMoney />
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
              background: 'linear-gradient(45deg, #fa709a 30%, #fee140 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e9608a 30%, #edd430 90%)',
              }
            }}
          >
            Add New Equipment
          </Button>
        </Box>

        {/* Data Table */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <DataTable
            data={equipment}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Paper>

        {/* Form Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
          </DialogTitle>
          <DialogContent>
            <EquipmentForm
              equipment={editingEquipment}
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

export default EquipmentList;
