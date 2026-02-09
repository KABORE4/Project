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
import { getMembers } from '../services/memberService';
import { getEquipment } from '../services/equipmentService';

const BookingForm = ({ booking, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    bookingCode: '',
    memberId: '',
    equipmentId: '',
    startDate: '',
    endDate: '',
    purpose: '',
    status: 'pending',
  });
  const [members, setMembers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (booking) {
      setFormData({
        bookingCode: booking.bookingCode || '',
        memberId: booking.memberId || '',
        equipmentId: booking.equipmentId || '',
        startDate: booking.startDate ? booking.startDate.split('T')[0] : '',
        endDate: booking.endDate ? booking.endDate.split('T')[0] : '',
        purpose: booking.purpose || '',
        status: booking.status || 'pending',
      });
    } else {
      // Generate booking code for new bookings
      const code = `BKG-${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, bookingCode: code }));
    }

    fetchMembers();
    fetchEquipment();
  }, [booking]);

  const fetchMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const data = await getEquipment();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving booking:', error);
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
            label="Booking Code"
            name="bookingCode"
            value={formData.bookingCode}
            onChange={handleChange}
            required
            disabled={!!booking}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
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
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Equipment</InputLabel>
            <Select
              name="equipmentId"
              value={formData.equipmentId}
              onChange={handleChange}
              label="Equipment"
            >
              {equipment
                .filter((eq) => eq.status === 'available')
                .map((eq) => (
                  <MenuItem key={eq.id} value={eq.id}>
                    {eq.name} ({eq.equipmentCode})
                  </MenuItem>
                ))}
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
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="in-use">In Use</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            multiline
            rows={3}
          />
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
              {loading ? 'Saving...' : (booking ? 'Update Booking' : 'Create Booking')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingForm;
