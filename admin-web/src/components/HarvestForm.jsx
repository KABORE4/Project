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
  Alert,
} from '@mui/material';
import { createHarvest, updateHarvest } from '../services/harvestService';
import { getMembers } from '../services/memberService';
import { getPlots } from '../services/plotService';

const HarvestForm = ({ harvest, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    harvestCode: '',
    memberId: '',
    plotId: '',
    crop: 'cotton',
    weight: '',
    unit: 'kg',
    harvestDate: '',
    quality: 'good',
    estimatedValue: '',
    status: 'pending',
  });
  const [members, setMembers] = useState([]);
  const [plots, setPlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (harvest) {
      setFormData({
        harvestCode: harvest.harvestCode || '',
        memberId: harvest.memberId || '',
        plotId: harvest.plotId || '',
        crop: harvest.crop || 'cotton',
        weight: harvest.weight || '',
        unit: harvest.unit || 'kg',
        harvestDate: harvest.harvestDate ? harvest.harvestDate.split('T')[0] : '',
        quality: harvest.quality || 'good',
        estimatedValue: harvest.estimatedValue || '',
        status: harvest.status || 'pending',
      });
    }
    fetchMembers();
    fetchPlots();
  }, [harvest]);

  const fetchMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchPlots = async () => {
    try {
      const data = await getPlots();
      setPlots(data);
    } catch (error) {
      console.error('Error fetching plots:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.harvestCode.trim()) newErrors.harvestCode = 'Harvest code is required';
    if (!formData.memberId) newErrors.memberId = 'Member is required';
    if (!formData.plotId) newErrors.plotId = 'Plot is required';
    if (!formData.weight || formData.weight <= 0) newErrors.weight = 'Weight must be greater than 0';
    if (!formData.harvestDate) newErrors.harvestDate = 'Harvest date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create clean data object to avoid XrayWrapper issues
      const cleanFormData = JSON.parse(JSON.stringify(formData));
      
      if (harvest) {
        await updateHarvest(harvest.id, cleanFormData);
      } else {
        await createHarvest(cleanFormData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving harvest:', error);
      setErrors({ submit: error.response?.data?.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.submit}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Harvest Code"
            name="harvestCode"
            value={formData.harvestCode}
            onChange={handleChange}
            error={!!errors.harvestCode}
            helperText={errors.harvestCode}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.memberId}>
            <InputLabel>Member</InputLabel>
            <Select
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              label="Member"
            >
              {members.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </MenuItem>
              ))}
            </Select>
            {errors.memberId && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.memberId}</Box>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.plotId}>
            <InputLabel>Plot</InputLabel>
            <Select
              name="plotId"
              value={formData.plotId}
              onChange={handleChange}
              label="Plot"
            >
              {plots.map((plot) => (
                <MenuItem key={plot.id} value={plot.id}>
                  {plot.plotCode} - {plot.location?.village || 'Unknown'}
                </MenuItem>
              ))}
            </Select>
            {errors.plotId && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.plotId}</Box>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Crop</InputLabel>
            <Select
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              label="Crop"
            >
              <MenuItem value="cotton">Cotton</MenuItem>
              <MenuItem value="millet">Millet</MenuItem>
              <MenuItem value="sorghum">Sorghum</MenuItem>
              <MenuItem value="maize">Maize</MenuItem>
              <MenuItem value="sesame">Sesame</MenuItem>
              <MenuItem value="peanut">Peanut</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Weight"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            error={!!errors.weight}
            helperText={errors.weight}
            required
            inputProps={{ min: 0.1, step: 0.1 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Unit</InputLabel>
            <Select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              label="Unit"
            >
              <MenuItem value="kg">kg</MenuItem>
              <MenuItem value="ton">ton</MenuItem>
              <MenuItem value="bag">bag</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Harvest Date"
            name="harvestDate"
            type="date"
            value={formData.harvestDate}
            onChange={handleChange}
            error={!!errors.harvestDate}
            helperText={errors.harvestDate}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Quality</InputLabel>
            <Select
              name="quality"
              value={formData.quality}
              onChange={handleChange}
              label="Quality"
            >
              <MenuItem value="excellent">Excellent</MenuItem>
              <MenuItem value="good">Good</MenuItem>
              <MenuItem value="average">Average</MenuItem>
              <MenuItem value="poor">Poor</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Estimated Value"
            name="estimatedValue"
            type="number"
            value={formData.estimatedValue}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="validated">Validated</MenuItem>
              <MenuItem value="stored">Stored</MenuItem>
              <MenuItem value="sold">Sold</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : (harvest ? 'Update' : 'Create')}
        </Button>
      </Box>
    </Box>
  );
};

export default HarvestForm;
