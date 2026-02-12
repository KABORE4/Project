import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
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
  Event, 
  Add, 
  Edit, 
  Delete, 
  Person, 
  Build,
  CalendarToday,
  Description,
  TrendingUp,
  Schedule
} from '@mui/icons-material';
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
    { 
      field: 'bookingCode', 
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
      field: 'memberId', 
      headerName: 'Member ID', 
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Person sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'equipmentId', 
      headerName: 'Equipment ID', 
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Build sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'startDate', 
      headerName: 'Start Date', 
      width: 120, 
      type: 'date',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarToday sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'endDate', 
      headerName: 'End Date', 
      width: 120, 
      type: 'date',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarToday sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'purpose', 
      headerName: 'Purpose', 
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Description sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 100, 
      type: 'status',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color={params.value === 'active' ? 'success' : params.value === 'completed' ? 'info' : 'default'}
        />
      )
    },
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
      // Force refetch with a small delay to ensure backend has processed the data
      setTimeout(() => {
        console.log('Force refetching bookings after save...');
        fetchBookings();
      }, 500);
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
    <Fade in>
      <Container maxWidth="xl" sx={{ py: 2, overflow: 'hidden', width: '100%', maxWidth: '100vw' }}>
        {/* Header Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Equipment Bookings
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage all equipment reservations and bookings
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #0984e3 0%, #00b894 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {bookings.length}
                    </Typography>
                    <Typography variant="body2">
                      Total Bookings
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Event />
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
                      {bookings.filter(b => b.status === 'active').length}
                    </Typography>
                    <Typography variant="body2">
                      Active Now
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Schedule />
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
                      {bookings.filter(b => b.status === 'completed').length}
                    </Typography>
                    <Typography variant="body2">
                      Completed
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <TrendingUp />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {[...new Set(bookings.map(b => b.equipmentId))].length}
                    </Typography>
                    <Typography variant="body2">
                      Equipment Types
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Build />
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
              background: 'linear-gradient(45deg, #0984e3 30%, #00b894 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #007a64 30%, #00a074 90%)',
              }
            }}
          >
            New Booking
          </Button>
        </Box>

        {/* Data Table */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <DataTable
            data={bookings}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Paper>

        {/* Form Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingBooking ? 'Edit Booking' : 'New Booking'}
          </DialogTitle>
          <DialogContent>
            <BookingForm
              booking={editingBooking}
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

export default BookingsList;
