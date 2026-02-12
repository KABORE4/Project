import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Snackbar, 
  Alert,
  Avatar,
  Fade,
  Chip
} from '@mui/material';
import { 
  Receipt, 
  Add, 
  Edit, 
  Delete, 
  AttachMoney, 
  CalendarToday,
  Person,
  Category,
  TrendingDown,
  AccountBalance
} from '@mui/icons-material';
import DataTable from '../components/DataTable';
import ExpenseForm from '../components/ExpenseForm';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../services/expenseService';

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { 
      field: 'expenseCode', 
      headerName: 'Code', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      )
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Category sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 120, 
      type: 'currency',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AttachMoney sx={{ mr: 1, color: 'success.main', fontSize: 16 }} />
          <Typography variant="body2" fontWeight="bold" color="success.main">
            ${params.value}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'paidBy', 
      headerName: 'Paid By', 
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Person sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'expenseDate', 
      headerName: 'Date', 
      width: 120, 
      type: 'date',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarToday sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      console.log('Fetched expenses:', data); // Debug log
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setSnackbar({ open: true, message: 'Error loading expenses', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingExpense(null);
    setOpen(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setOpen(true);
  };

  const handleDelete = async (expense) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expense._id);
        setSnackbar({ open: true, message: 'Expense deleted successfully', severity: 'success' });
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        setSnackbar({ open: true, message: 'Error deleting expense', severity: 'error' });
      }
    }
  };

  const handleSave = async (expenseData) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense._id, expenseData);
        setSnackbar({ open: true, message: 'Expense updated successfully', severity: 'success' });
      } else {
        await createExpense(expenseData);
        setSnackbar({ open: true, message: 'Expense created successfully', severity: 'success' });
      }
      setOpen(false);
      // Force refetch with a small delay to ensure backend has processed the data
      setTimeout(() => {
        console.log('Force refetching expenses after save...');
        fetchExpenses();
      }, 500);
    } catch (error) {
      console.error('Error saving expense:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error saving expense';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingExpense(null);
  };

  return (
    <Fade in>
      <Container maxWidth="xl" sx={{ py: 2, overflow: 'hidden', width: '100%', maxWidth: '100vw' }}>
        {/* Header Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Expenses Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Track and manage all cooperative expenses
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      ${expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0).toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Total Expenses
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Receipt />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {expenses.length}
                    </Typography>
                    <Typography variant="body2">
                      Total Records
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <TrendingDown />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      ${expenses.length > 0 ? (expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0) / expenses.length).toFixed(2) : '0.00'}
                    </Typography>
                    <Typography variant="body2">
                      Average Expense
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <AttachMoney />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {[...new Set(expenses.map(e => e.category))].length}
                    </Typography>
                    <Typography variant="body2">
                      Categories
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Category />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{
              background: 'linear-gradient(45deg, #f093fb 30%, #f5576c 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e083eb 30%, #e4475c 90%)',
              }
            }}
          >
            Add New Expense
          </Button>
        </Box>

        {/* Data Table */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <DataTable
            data={expenses}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Paper>

        {/* Form Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </DialogTitle>
          <DialogContent>
            <ExpenseForm
              expense={editingExpense}
              onSave={handleSave}
              onCancel={handleClose}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Fade>
  );
};

export default ExpensesList;
