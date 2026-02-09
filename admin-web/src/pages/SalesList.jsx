import { useState, useEffect } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
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
    { field: 'saleCode', headerName: 'Code', width: 120 },
    { field: 'crop', headerName: 'Crop', width: 100 },
    { field: 'totalWeight', headerName: 'Weight', width: 100, type: 'number' },
    { field: 'buyerName', headerName: 'Buyer', width: 150 },
    { field: 'unitPrice', headerName: 'Unit Price', width: 120, type: 'currency' },
    { field: 'saleDate', headerName: 'Date', width: 120, type: 'date' },
    {
      field: 'totalRevenue',
      headerName: 'Revenue',
      width: 120,
      type: 'currency',
      render: (value) => value ? `$${Number(value).toLocaleString()}` : '$0'
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
      fetchSales();
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
    <Box sx={{ p: 3 }}>
      <DataTable
        title="Sales Management"
        columns={columns}
        data={sales}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        loading={loading}
        searchPlaceholder="Search sales..."
        addButtonText="Add Sale"
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSale ? 'Edit Sale' : 'Add New Sale'}
        </DialogTitle>
        <DialogContent>
          <SaleForm
            sale={editingSale}
            onSave={handleSave}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SalesList;
