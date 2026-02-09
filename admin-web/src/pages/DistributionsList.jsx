import { useState, useEffect } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
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
    { field: 'distributionCode', headerName: 'Code', width: 120 },
    { field: 'saleId', headerName: 'Sale ID', width: 120 },
    { field: 'totalRevenue', headerName: 'Revenue', width: 120, type: 'currency' },
    { field: 'cooperativeShare', headerName: 'Coop Share', width: 120, render: (value) => `${(value * 100).toFixed(1)}%` },
    { field: 'distributionDate', headerName: 'Date', width: 120, type: 'date' },
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
      fetchDistributions();
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
    <Box sx={{ p: 3 }}>
      <DataTable
        title="Profit Distributions"
        columns={columns}
        data={distributions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        loading={loading}
        searchPlaceholder="Search distributions..."
        addButtonText="Add Distribution"
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingDistribution ? 'Edit Distribution' : 'Add New Distribution'}
        </DialogTitle>
        <DialogContent>
          <DistributionForm
            distribution={editingDistribution}
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

export default DistributionsList;
