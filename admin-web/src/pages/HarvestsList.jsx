import { useState, useEffect } from 'react';
import { Container, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
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
    { field: 'harvestCode', headerName: 'Harvest Code', width: 130 },
    { field: 'memberId', headerName: 'Member ID', width: 120 },
    { field: 'plotId', headerName: 'Plot ID', width: 120 },
    { field: 'crop', headerName: 'Crop', width: 100 },
    { field: 'weight', headerName: 'Weight', width: 100, type: 'number', render: (value, item) => `${value} ${item.unit}` },
    { field: 'harvestDate', headerName: 'Date', width: 120, type: 'date' },
    { field: 'quality', headerName: 'Quality', width: 100 },
    { field: 'status', headerName: 'Status', width: 100, type: 'status' },
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
    fetchHarvests();
    handleFormClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <DataTable
        title="Harvests"
        columns={columns}
        data={harvests}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        searchPlaceholder="Search harvests..."
        addButtonText="Add Harvest"
      />

      <Dialog open={openForm} onClose={handleFormClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingHarvest ? 'Edit Harvest' : 'Add New Harvest'}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HarvestsList;
