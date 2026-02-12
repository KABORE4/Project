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
  InputAdornment,
} from '@mui/material';

const ExpenseForm = ({ expense, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    expenseCode: '', // Empty for auto-generation
    category: '',
    description: '',
    amount: '',
    paidBy: '',
    expenseDate: new Date().toISOString().split('T')[0],
    beneficiaries: [],
    status: 'pending',
    approvalStatus: 'pending',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        expenseCode: expense.expenseCode || '',
        category: expense.category || '',
        description: expense.description || '',
        amount: expense.amount || '',
        paidBy: expense.paidBy || '',
        expenseDate: expense.expenseDate || new Date().toISOString().split('T')[0],
        beneficiaries: expense.beneficiaries || [],
        status: expense.status || 'pending',
        approvalStatus: expense.approvalStatus || 'pending',
      });
    }
  }, [expense]);

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

  const handleDateChange = (e) => {
    setFormData(prev => ({
      ...prev,
      expenseDate: e.target.value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.paidBy.trim()) {
      newErrors.paidBy = 'Paid by field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };
      
      // Create clean data object to avoid XrayWrapper issues
      const cleanExpenseData = JSON.parse(JSON.stringify(expenseData));
      
      // Remove fields that shouldn't be sent to backend for new expenses
      if (!expense) {
        delete cleanExpenseData._id;
        delete cleanExpenseData.expenseCode; // Let backend generate it
      }
      
      console.log('Submitting expense data:', cleanExpenseData);
      const result = await onSave(cleanExpenseData);
      // Clean the result if needed
      const cleanResult = result ? JSON.parse(JSON.stringify(result)) : null;
      return cleanResult;
    } catch (error) {
      console.error('Error saving expense:', error);
      setErrors({ submit: error.response?.data?.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'maintenance', label: 'Equipment Maintenance' },
    { value: 'fertilizer', label: 'Fertilizers' },
    { value: 'seeds', label: 'Seeds' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'labor', label: 'Labor' },
    { value: 'storage', label: 'Storage' },
    { value: 'transport', label: 'Transportation' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Expense Code"
            name="expenseCode"
            value={formData.expenseCode}
            onChange={handleChange}
            disabled={!!expense}
            helperText={expense ? "Auto-generated for new expenses" : "Leave empty for auto-generation"}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.category}
              </Alert>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            error={!!errors.amount}
            helperText={errors.amount}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Paid By"
            name="paidBy"
            value={formData.paidBy}
            onChange={handleChange}
            error={!!errors.paidBy}
            helperText={errors.paidBy}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Expense Date"
            name="expenseDate"
            type="date"
            value={formData.expenseDate}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (expense ? 'Update' : 'Create')} Expense
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpenseForm;
