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
  ShoppingCart, 
  Add, 
  Edit, 
  Delete, 
  Person, 
  Grass,
  Scale,
  AttachMoney,
  CalendarToday,
  TrendingUp,
  Receipt
} from '@mui/icons-material';
import DataTable from '../components/DataTable';
import SaleForm from '../components/SaleForm';
import { getSales, createSale, updateSale, deleteSale } from '../services/saleService';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { 
      field: 'saleCode', 
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
      field: 'totalWeight', 
      headerName: 'Weight', 
      width: 100, 
      type: 'number',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Scale sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{parseFloat(params.value) || 0} kg</Typography>
        </Box>
      )
    },
    { 
      field: 'buyerName', 
      headerName: 'Buyer', 
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Person sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'unitPrice', 
      headerName: 'Unit Price', 
      width: 120, 
      type: 'currency',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AttachMoney sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">${parseFloat(params.value) || 0}</Typography>
        </Box>
      )
    },
    { 
      field: 'saleDate', 
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
      field: 'totalRevenue',
      headerName: 'Revenue',
      width: 120,
      type: 'currency',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Receipt sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2" fontWeight="bold" color="success.main">
            ${parseFloat(params.value) || 0}
          </Typography>
        </Box>
      )
    },
  ];

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await getSales();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setSnackbar({ open: true, message: 'Error loading sales', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSale(null);
    setOpen(true);
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setOpen(true);
  };

  const handleDelete = async (sale) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await deleteSale(sale._id);
        setSnackbar({ open: true, message: 'Sale deleted successfully', severity: 'success' });
        fetchSales();
      } catch (error) {
        console.error('Error deleting sale:', error);
        setSnackbar({ open: true, message: 'Error deleting sale', severity: 'error' });
      }
    }
  };

  const handleSave = async (saleData) => {
    try {
      if (editingSale) {
        await updateSale(editingSale._id, saleData);
        setSnackbar({ open: true, message: 'Sale updated successfully', severity: 'success' });
      } else {
        await createSale(saleData);
        setSnackbar({ open: true, message: 'Sale created successfully', severity: 'success' });
      }
      setOpen(false);
      // Force refetch with a small delay to ensure backend has processed the data
      setTimeout(() => {
        console.log('Force refetching sales after save...');
        fetchSales();
      }, 500);
    } catch (error) {
      console.error('Error saving sale:', error);
      setSnackbar({ open: true, message: 'Error saving sale', severity: 'error' });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSale(null);
  };

  return (
    <Fade in>
      <Container maxWidth="xl" sx={{ py: 2, overflow: 'hidden', width: '100%', maxWidth: '100vw' }}>
        {/* Header Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Sales Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Track and manage all crop sales and revenue
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #00b894 0%, #00a074 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {sales.length}
                    </Typography>
                    <Typography variant="body2">
                      Total Sales
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <ShoppingCart />
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
                      ${sales.reduce((sum, s) => sum + (parseFloat(s.totalRevenue) || 0), 0).toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Total Revenue
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
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {sales.reduce((sum, s) => sum + (parseFloat(s.totalWeight) || 0), 0).toFixed(1)} kg
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
                      {[...new Set(sales.map(s => s.crop))].length}
                    </Typography>
                    <Typography variant="body2">
                      Crop Types
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Grass />
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
              background: 'linear-gradient(45deg, #00b894 30%, #00a074 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #009670 30%, #008f63 90%)',
              }
            }}
          >
            Record New Sale
          </Button>
        </Box>

        {/* Data Table */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <DataTable
            data={sales}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Paper>

        {/* Form Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingSale ? 'Edit Sale' : 'Record New Sale'}
          </DialogTitle>
          <DialogContent>
            <SaleForm
              sale={editingSale}
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

export default SalesList;
