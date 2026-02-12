import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';

const EquipmentForm = ({ equipment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    equipmentCode: '',
    name: '',
    type: '',
    purchasePrice: '',
    rentalRate: '',
    rentalUnit: 'per-day',
    status: 'available',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (equipment) {
      setFormData({
        equipmentCode: equipment.equipmentCode || '',
        name: equipment.name || '',
        type: equipment.type || '',
        purchasePrice: equipment.purchasePrice || '',
        rentalRate: equipment.rentalRate || '',
        rentalUnit: equipment.rentalUnit || 'per-day',
        status: equipment.status || 'available',
      });
    } else {
      // Generate equipment code for new equipment
      const code = `EQP-${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, equipmentCode: code }));
    }
  }, [equipment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create clean data object to avoid XrayWrapper issues
      const cleanFormData = JSON.parse(JSON.stringify(formData));
      await onSave(cleanFormData);
    } catch (error) {
      console.error('Error saving equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Equipment Code"
            name="equipmentCode"
            value={formData.equipmentCode}
            onChange={handleChange}
            required
            disabled={!!equipment}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Type"
            >
              <MenuItem value="heavy">Heavy Equipment</MenuItem>
              <MenuItem value="light">Light Equipment</MenuItem>
              <MenuItem value="transport">Transport</MenuItem>
              <MenuItem value="irrigation">Irrigation</MenuItem>
              <MenuItem value="storage">Storage</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="in-use">In Use</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
              <MenuItem value="retired">Retired</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Purchase Price"
            name="purchasePrice"
            type="number"
            value={formData.purchasePrice}
            onChange={handleChange}
            InputProps={{ startAdornment: '$' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Rental Rate"
            name="rentalRate"
            type="number"
            value={formData.rentalRate}
            onChange={handleChange}
            required
            InputProps={{ startAdornment: '$' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Rental Unit</InputLabel>
            <Select
              name="rentalUnit"
              value={formData.rentalUnit}
              onChange={handleChange}
              label="Rental Unit"
            >
              <MenuItem value="per-hour">Per Hour</MenuItem>
              <MenuItem value="per-day">Per Day</MenuItem>
              <MenuItem value="per-week">Per Week</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Saving...' : (equipment ? 'Update Equipment' : 'Create Equipment')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EquipmentForm;
