import { useState, useEffect } from 'react';
import { Container, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
import DataTable from '../components/DataTable';
import MemberForm from '../components/MemberForm';
import { getMembers, deleteMember } from '../services/memberService';

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'village', headerName: 'Village', width: 150 },
    { field: 'plotSize', headerName: 'Plot Size (ha)', width: 120, type: 'number' },
    { field: 'role', headerName: 'Role', width: 100 },
    { field: 'status', headerName: 'Status', width: 100, type: 'status' },
  ];

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await getMembers();
      console.log('Fetched members:', data); // Debug log
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      setSnackbar({ open: true, message: 'Error loading members', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(fetchMembers, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = () => {
    setEditingMember(null);
    setOpenForm(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setOpenForm(true);
  };

  const handleDelete = async (member) => {
    if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      try {
        await deleteMember(member.id);
        setSnackbar({ open: true, message: 'Member deleted successfully', severity: 'success' });
        fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
        setSnackbar({ open: true, message: 'Error deleting member', severity: 'error' });
      }
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingMember(null);
  };

  const handleFormSuccess = (updatedMember) => {
    console.log('handleFormSuccess called with:', updatedMember);
    console.log('editingMember:', editingMember);
    
    setSnackbar({
      open: true,
      message: editingMember ? 'Member updated successfully' : 'Member added successfully',
      severity: 'success'
    });
    
    if (editingMember && updatedMember) {
      console.log('Updating local state...');
      // Update local state immediately for edited member
      setMembers(prev => {
        const updated = prev.map(member => 
          member.id === editingMember.id ? { ...member, ...updatedMember } : member
        );
        console.log('Updated members:', updated);
        return updated;
      });
    } else {
      // Refetch for new members
      fetchMembers();
    }
    
    // Also force a refetch after a short delay to ensure sync
    setTimeout(() => {
      console.log('Force refetching members...');
      fetchMembers();
    }, 500);
    
    handleFormClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <DataTable
        title="Members"
        columns={columns}
        data={members}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        searchPlaceholder="Search members..."
        addButtonText="Add Member"
      />

      <Dialog open={openForm} onClose={handleFormClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMember ? 'Edit Member' : 'Add New Member'}
        </DialogTitle>
        <DialogContent>
          <MemberForm
            member={editingMember}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MembersList;
