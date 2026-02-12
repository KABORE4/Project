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
import { getSales } from '../services/saleService';
import { getMembers } from '../services/memberService';

const DistributionForm = ({ distribution, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    distributionCode: '',
    saleId: '',
    totalRevenue: '',
    cooperativeShare: 0.1,
    memberDistributions: [],
    distributionDate: '',
  });
  const [sales, setSales] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (distribution) {
      setFormData({
        distributionCode: distribution.distributionCode || '',
        saleId: distribution.saleId || '',
        totalRevenue: distribution.totalRevenue || '',
        cooperativeShare: distribution.cooperativeShare || 0.1,
        memberDistributions: distribution.memberDistributions || [],
        distributionDate: distribution.distributionDate ? distribution.distributionDate.split('T')[0] : '',
      });
    } else {
      // Generate distribution code for new distributions
      const code = `DIST-${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, distributionCode: code }));
    }

    fetchSales();
    fetchMembers();
  }, [distribution]);

  const fetchSales = async () => {
    try {
      const data = await getSales();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
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

    if (name === 'saleId') {
      const sale = sales.find(s => s.id === value);
      setSelectedSale(sale);
      if (sale) {
        setFormData(prev => ({
          ...prev,
          totalRevenue: sale.totalRevenue || (sale.totalWeight * sale.unitPrice),
          memberDistributions: sale.memberIds?.map(memberId => ({
            memberId,
            sharePercentage: 100 / (sale.memberIds.length || 1)
          })) || []
        }));
      }
    }
  };

  const handleMemberShareChange = (memberId, sharePercentage) => {
    setFormData(prev => ({
      ...prev,
      memberDistributions: prev.memberDistributions.map(dist =>
        dist.memberId === memberId ? { ...dist, sharePercentage: parseFloat(sharePercentage) || 0 } : dist
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      // Create clean data object to avoid XrayWrapper issues
      const cleanFormData = JSON.parse(JSON.stringify(formData));
      console.log('Submitting distribution data:', cleanFormData);
      await onSave(cleanFormData);
    } catch (error) {
      console.error('Error saving distribution:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalMemberShares = formData.memberDistributions.reduce((sum, dist) => sum + (dist.sharePercentage || 0), 0);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Distribution Code"
            name="distributionCode"
            value={formData.distributionCode}
            onChange={handleChange}
            required
            disabled={!!distribution}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Sale</InputLabel>
            <Select
              name="saleId"
              value={formData.saleId}
              onChange={handleChange}
              label="Sale"
            >
              {sales.map((sale) => (
                <MenuItem key={sale.id} value={sale.id}>
                  {sale.saleCode} - {sale.crop} ({sale.totalWeight}kg)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Total Revenue"
            name="totalRevenue"
            type="number"
            value={formData.totalRevenue}
            onChange={handleChange}
            required
            InputProps={{ startAdornment: '$' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cooperative Share (%)"
            name="cooperativeShare"
            type="number"
            value={formData.cooperativeShare * 100}
            onChange={(e) => setFormData(prev => ({ ...prev, cooperativeShare: parseFloat(e.target.value) / 100 }))}
            required
            inputProps={{ min: 0, max: 100, step: 0.1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Distribution Date"
            name="distributionDate"
            type="date"
            value={formData.distributionDate}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {formData.memberDistributions.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Member Distributions
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={`Total Member Shares: ${totalMemberShares.toFixed(1)}%`}
                color={totalMemberShares === (1 - formData.cooperativeShare) * 100 ? 'success' : 'warning'}
              />
            </Box>
            {formData.memberDistributions.map((dist, index) => {
              const member = members.find(m => m.id === dist.memberId);
              return (
                <Grid container spacing={2} key={dist.memberId} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography>{member?.name || 'Unknown Member'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Share %"
                      type="number"
                      value={dist.sharePercentage || 0}
                      onChange={(e) => handleMemberShareChange(dist.memberId, e.target.value)}
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                    />
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        )}

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
              {loading ? 'Saving...' : (distribution ? 'Update Distribution' : 'Create Distribution')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DistributionForm;
