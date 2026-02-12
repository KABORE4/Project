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
  Typography,
  Chip,
} from '@mui/material';
import { getHarvests } from '../services/harvestService';
import { getMembers } from '../services/memberService';

const SaleForm = ({ sale, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    saleCode: '',
    harvestIds: [],
    memberIds: [],
    crop: '',
    totalWeight: '',
    buyerName: '',
    unitPrice: '',
    saleDate: '',
  });
  const [harvests, setHarvests] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sale) {
      setFormData({
        saleCode: sale.saleCode || '',
        harvestIds: sale.harvestIds || [],
        memberIds: sale.memberIds || [],
        crop: sale.crop || '',
        totalWeight: sale.totalWeight || '',
        buyerName: sale.buyerName || '',
        unitPrice: sale.unitPrice || '',
        saleDate: sale.saleDate ? sale.saleDate.split('T')[0] : '',
      });
    } else {
      // Generate sale code for new sales
      const code = `SAL-${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, saleCode: code }));
    }

    fetchHarvests();
    fetchMembers();
  }, [sale]);

  const fetchHarvests = async () => {
    try {
      const data = await getHarvests();
      setHarvests(data);
    } catch (error) {
      console.error('Error fetching harvests:', error);
    }
  };

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'harvestIds') {
      // Auto-populate crop and total weight from selected harvests
      const selectedHarvests = harvests.filter(h => value.includes(h.id));
      if (selectedHarvests.length > 0) {
        const crop = selectedHarvests[0].crop;
        const totalWeight = selectedHarvests.reduce((sum, h) => sum + (h.weight || 0), 0);
        const memberIds = [...new Set(selectedHarvests.map(h => h.memberId))];

        setFormData(prev => ({
          ...prev,
          crop,
          totalWeight,
          memberIds
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create clean data object to avoid XrayWrapper issues
      const cleanFormData = JSON.parse(JSON.stringify(formData));
      await onSave(cleanFormData);
    } catch (error) {
      console.error('Error saving sale:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = formData.totalWeight * formData.unitPrice;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Sale Code"
            name="saleCode"
            value={formData.saleCode}
            onChange={handleChange}
            required
            disabled={!!sale}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Buyer Name"
            name="buyerName"
            value={formData.buyerName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Harvests</InputLabel>
            <Select
              multiple
              name="harvestIds"
              value={formData.harvestIds}
              onChange={(e) => handleMultiSelectChange('harvestIds', e.target.value)}
              label="Harvests"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const harvest = harvests.find(h => h.id === id);
                    return (
                      <Chip key={id} label={harvest?.harvestCode || id} size="small" />
                    );
                  })}
                </Box>
              )}
            >
              {harvests
                .filter(h => h.status !== 'sold')
                .map((harvest) => (
                  <MenuItem key={harvest.id} value={harvest.id}>
                    {harvest.harvestCode} - {harvest.crop} ({harvest.weight}kg) [{harvest.status}]
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Members</InputLabel>
            <Select
              multiple
              name="memberIds"
              value={formData.memberIds}
              onChange={(e) => handleMultiSelectChange('memberIds', e.target.value)}
              label="Members"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const member = members.find(m => m.id === id);
                    return (
                      <Chip key={id} label={member?.name || id} size="small" />
                    );
                  })}
                </Box>
              )}
            >
              {members.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Crop"
            name="crop"
            value={formData.crop}
            onChange={handleChange}
            required
            select
          >
            <MenuItem value="cotton">Cotton</MenuItem>
            <MenuItem value="millet">Millet</MenuItem>
            <MenuItem value="sorghum">Sorghum</MenuItem>
            <MenuItem value="maize">Maize</MenuItem>
            <MenuItem value="sesame">Sesame</MenuItem>
            <MenuItem value="peanut">Peanut</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Total Weight (kg)"
            name="totalWeight"
            type="number"
            value={formData.totalWeight}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Unit Price ($)"
            name="unitPrice"
            type="number"
            value={formData.unitPrice}
            onChange={handleChange}
            required
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Sale Date"
            name="saleDate"
            type="date"
            value={formData.saleDate}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">
            Total Revenue: ${totalRevenue.toLocaleString()}
          </Typography>
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
              {loading ? 'Saving...' : (sale ? 'Update Sale' : 'Create Sale')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SaleForm;
