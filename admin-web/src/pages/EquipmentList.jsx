import { useState, useEffect } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
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
    { field: 'equipmentCode', headerName: 'Code', width: 120 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'rentalRate', headerName: 'Rate', width: 100, type: 'currency' },
    { field: 'rentalUnit', headerName: 'Unit', width: 100 },
    { field: 'status', headerName: 'Status', width: 100, type: 'status' },
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
      fetchEquipment();
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
    <Box sx={{ p: 3 }}>
      <DataTable
        title="Equipment Management"
        columns={columns}
        data={equipment}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        loading={loading}
        searchPlaceholder="Search equipment..."
        addButtonText="Add Equipment"
      />

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

export default EquipmentList;
