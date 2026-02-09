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
  Chip,
} from '@mui/material';
import { createPlot, updatePlot, getPlotsByMember } from '../services/plotService';
import { getMembers } from '../services/memberService';

const PlotForm = ({ plot, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    plotCode: '',
    memberId: '',
    size: '',
    location: {
      latitude: '',
      longitude: '',
      village: '',
      sector: '',
    },
    soilType: 'mixed',
    waterAccess: 'rain-fed',
    crops: [],
  });
  const [members, setMembers] = useState([]);
  const [cropInput, setCropInput] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plot) {
      setFormData({
        plotCode: plot.plotCode || '',
        memberId: plot.memberId || '',
        size: plot.size || '',
        location: plot.location || {
          latitude: '',
          longitude: '',
          village: '',
          sector: '',
        },
        soilType: plot.soilType || 'mixed',
        waterAccess: plot.waterAccess || 'rain-fed',
        crops: plot.crops || [],
      });
    }
    fetchMembers();
  }, [plot]);

  const fetchMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddCrop = () => {
    if (cropInput.trim() && !formData.crops.includes(cropInput.trim())) {
      setFormData(prev => ({
        ...prev,
        crops: [...prev.crops, cropInput.trim()]
      }));
      setCropInput('');
    }
  };

  const handleRemoveCrop = (cropToRemove) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.filter(crop => crop !== cropToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.plotCode.trim()) newErrors.plotCode = 'Plot code is required';
    if (!formData.memberId) newErrors.memberId = 'Member is required';
    if (!formData.size || formData.size <= 0) newErrors.size = 'Size must be greater than 0';
    if (!formData.location.village.trim()) newErrors['location.village'] = 'Village is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (plot) {
        await updatePlot(plot.id, formData);
      } else {
        await createPlot(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving plot:', error);
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
            label="Plot Code"
            name="plotCode"
            value={formData.plotCode}
            onChange={handleChange}
            error={!!errors.plotCode}
            helperText={errors.plotCode}
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
          <TextField
            fullWidth
            label="Size (ha)"
            name="size"
            type="number"
            value={formData.size}
            onChange={handleChange}
            error={!!errors.size}
            helperText={errors.size}
            required
            inputProps={{ min: 0.1, step: 0.1 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Soil Type</InputLabel>
            <Select
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
              label="Soil Type"
            >
              <MenuItem value="sandy">Sandy</MenuItem>
              <MenuItem value="loamy">Loamy</MenuItem>
              <MenuItem value="clay">Clay</MenuItem>
              <MenuItem value="mixed">Mixed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Water Access</InputLabel>
            <Select
              name="waterAccess"
              value={formData.waterAccess}
              onChange={handleChange}
              label="Water Access"
            >
              <MenuItem value="well">Well</MenuItem>
              <MenuItem value="river">River</MenuItem>
              <MenuItem value="rain-fed">Rain-fed</MenuItem>
              <MenuItem value="irrigation">Irrigation</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Village"
            name="location.village"
            value={formData.location.village}
            onChange={handleChange}
            error={!!errors['location.village']}
            helperText={errors['location.village']}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Sector"
            name="location.sector"
            value={formData.location.sector}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Latitude"
            name="location.latitude"
            type="number"
            value={formData.location.latitude}
            onChange={handleChange}
            inputProps={{ step: 0.000001 }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Longitude"
            name="location.longitude"
            type="number"
            value={formData.location.longitude}
            onChange={handleChange}
            inputProps={{ step: 0.000001 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Add Crop"
              value={cropInput}
              onChange={(e) => setCropInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCrop())}
              helperText="Press Enter to add crop"
            />
            <Button onClick={handleAddCrop} sx={{ mt: 1 }}>Add Crop</Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.crops.map((crop) => (
              <Chip
                key={crop}
                label={crop}
                onDelete={() => handleRemoveCrop(crop)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
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
          {loading ? 'Saving...' : (plot ? 'Update' : 'Create')}
        </Button>
      </Box>
    </Box>
  );
};

export default PlotForm;
