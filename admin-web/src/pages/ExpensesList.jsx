import { useState, useEffect } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
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
    { field: 'expenseCode', headerName: 'Code', width: 120 },
    { field: 'category', headerName: 'Category', width: 120 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 120, type: 'currency' },
    { field: 'paidBy', headerName: 'Paid By', width: 120 },
    { field: 'expenseDate', headerName: 'Date', width: 120, type: 'date' },
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
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
      fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
      setSnackbar({ open: true, message: 'Error saving expense', severity: 'error' });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingExpense(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <DataTable
        title="Shared Expenses"
        columns={columns}
        data={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        loading={loading}
        searchPlaceholder="Search expenses..."
        addButtonText="Add Expense"
      />

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

export default ExpensesList;
