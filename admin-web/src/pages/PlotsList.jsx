import { useState, useEffect } from 'react';
import { Container, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
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
    { field: 'plotCode', headerName: 'Plot Code', width: 120 },
    { field: 'memberId', headerName: 'Member ID', width: 120 },
    { field: 'size', headerName: 'Size (ha)', width: 100, type: 'number' },
    { field: 'location.village', headerName: 'Village', width: 120, render: (value) => value || 'N/A' },
    { field: 'soilType', headerName: 'Soil Type', width: 100 },
    { field: 'waterAccess', headerName: 'Water Access', width: 120 },
    { field: 'crops', headerName: 'Crops', width: 150, render: (value) => Array.isArray(value) ? value.join(', ') : value },
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
    fetchPlots();
    handleFormClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <DataTable
        title="Plots"
        columns={columns}
        data={plots}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        searchPlaceholder="Search plots..."
        addButtonText="Add Plot"
      />

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

export default PlotsList;
