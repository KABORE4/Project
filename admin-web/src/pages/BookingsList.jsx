import { useState, useEffect } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
import DataTable from '../components/DataTable';
import BookingForm from '../components/BookingForm';
import { getBookings, createBooking, updateBooking, deleteBooking } from '../services/bookingService';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { field: 'bookingCode', headerName: 'Code', width: 120 },
    { field: 'memberId', headerName: 'Member ID', width: 120 },
    { field: 'equipmentId', headerName: 'Equipment ID', width: 120 },
    { field: 'startDate', headerName: 'Start Date', width: 120, type: 'date' },
    { field: 'endDate', headerName: 'End Date', width: 120, type: 'date' },
    { field: 'purpose', headerName: 'Purpose', width: 200 },
    { field: 'status', headerName: 'Status', width: 100, type: 'status' },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setSnackbar({ open: true, message: 'Error loading bookings', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingBooking(null);
    setOpen(true);
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setOpen(true);
  };

  const handleDelete = async (booking) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(booking._id);
        setSnackbar({ open: true, message: 'Booking deleted successfully', severity: 'success' });
        fetchBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
        setSnackbar({ open: true, message: 'Error deleting booking', severity: 'error' });
      }
    }
  };

  const handleSave = async (bookingData) => {
    try {
      if (editingBooking) {
        await updateBooking(editingBooking._id, bookingData);
        setSnackbar({ open: true, message: 'Booking updated successfully', severity: 'success' });
      } else {
        await createBooking(bookingData);
        setSnackbar({ open: true, message: 'Booking created successfully', severity: 'success' });
      }
      setOpen(false);
      fetchBookings();
    } catch (error) {
      console.error('Error saving booking:', error);
      setSnackbar({ open: true, message: 'Error saving booking', severity: 'error' });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBooking(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <DataTable
        title="Equipment Bookings"
        columns={columns}
        data={bookings}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        loading={loading}
        searchPlaceholder="Search bookings..."
        addButtonText="Add Booking"
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBooking ? 'Edit Booking' : 'Add New Booking'}
        </DialogTitle>
        <DialogContent>
          <BookingForm
            booking={editingBooking}
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

export default BookingsList;
