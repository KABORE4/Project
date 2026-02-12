import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Snackbar, 
  Alert,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Fade
} from '@mui/material';
import { 
  People, 
  Add, 
  Edit, 
  Delete, 
  Email, 
  Phone, 
  LocationOn, 
  Agriculture,
  TrendingUp,
  Person
} from '@mui/icons-material';
import DataTable from '../components/DataTable';
import MemberForm from '../components/MemberForm';
import { getMembers, updateMember } from '../services/memberService';

const MembersList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 150,
      renderCell: ({ value, row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 1, width: 24, height: 24, bgcolor: '#667eea' }}>
            <Person fontSize="small" />
          </Avatar>
          <Typography variant="body2" fontWeight="medium" noWrap>
            {value}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 180,
      renderCell: ({ value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Email sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{value}</Typography>
        </Box>
      )
    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      width: 120,
      renderCell: ({ value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Phone sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2" noWrap>{value}</Typography>
        </Box>
      )
    },
    { 
      field: 'village', 
      headerName: 'Village', 
      width: 120,
      renderCell: ({ value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOn sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2" noWrap>{value}</Typography>
        </Box>
      )
    },
    { 
      field: 'plotSize', 
      headerName: 'Plot Size', 
      width: 100,
      renderCell: ({ value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Agriculture sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
          <Typography variant="body2">{value} ha</Typography>
        </Box>
      )
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 100,
      renderCell: ({ value }) => (
        <Chip 
          label={value} 
          size="small" 
          color={value === 'admin' ? 'primary' : 'default'}
          variant="outlined"
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 100, 
      type: 'status',
      renderCell: ({ value }) => (
        <Chip 
          label={value} 
          size="small" 
          color={value === 'active' ? 'success' : 'default'}
        />
      )
    },
  ];

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await getMembers();
      console.log('Fetched members:', data); // Debug log
      
      // S'assurer que tous les membres ont un statut
      const membersWithStatus = data.map(member => ({
        ...member,
        status: member.status || 'active' // Par défaut 'active' si pas de statut
      }));
      
      setMembers(membersWithStatus);
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

  const handleToggleStatus = async (member) => {
    const currentStatus = member.status || 'active'; // Utiliser le statut actuel
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = currentStatus === 'active' ? 'disable' : 'enable';
    
    console.log('handleToggleStatus called with:', { member, currentStatus, newStatus, action }); // Debug
    
    if (window.confirm(`Are you sure you want to ${action} ${member.name}?`)) {
      try {
        // Mettre à jour le statut du membre
        const updatedMember = {
          ...member,
          status: newStatus
        };
        
        console.log('Updating member with:', updatedMember); // Debug
        await updateMember(member.id, updatedMember);
        setSnackbar({ 
          open: true, 
          message: `Member ${action}d successfully`, 
          severity: 'success' 
        });
        console.log('Member updated, calling fetchMembers...'); // Debug
        fetchMembers();
      } catch (error) {
        console.error(`Error ${action}ing member:`, error);
        setSnackbar({ 
          open: true, 
          message: `Error ${action}ing member`, 
          severity: 'error' 
        });
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
    
    setSnackbar({ open: true, message: editingMember ? 'Member updated successfully' : 'Member added successfully', severity: 'success' });
    
    handleFormClose();
    
    // Force refetch with a small delay to ensure backend has processed the data
    setTimeout(() => {
      console.log('Force refetching members after save...');
      fetchMembers();
    }, 500);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Fade in>
      <Container maxWidth="xl" sx={{ py: 1, overflow: 'hidden', width: '100%', maxWidth: '100vw' }}>
        {/* Header Section */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Members Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage all cooperative members and their information
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <CardContent sx={{ padding: '8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {members.length}
                    </Typography>
                    <Typography variant="body2">
                      Total Members
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 24, height: 24 }}>
                    <People />
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
              <CardContent sx={{ padding: '8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {members.filter(m => m.status === 'active').length}
                    </Typography>
                    <Typography variant="body2">
                      Active Members
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 24, height: 24 }}>
                    <TrendingUp />
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
              <CardContent sx={{ padding: '8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {members.reduce((sum, m) => sum + (parseFloat(m.plotSize) || 0), 0).toFixed(1)}
                    </Typography>
                    <Typography variant="body2">
                      Total Hectares
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 24, height: 24 }}>
                    <Agriculture />
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
              <CardContent sx={{ padding: '8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {members.filter(m => m.role === 'admin').length}
                    </Typography>
                    <Typography variant="body2">
                      Admins
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 24, height: 24 }}>
                    <Person />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Button */}
        <Box sx={{ mb: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
              }
            }}
          >
            Add New Member
          </Button>
        </Box>

        {/* Data Table */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <DataTable
            data={members}
            columns={columns}
            loading={loading}
            onEdit={null}  // Pas de bouton de modification
            onDelete={handleToggleStatus}
          />
        </Paper>

        {/* Form Dialog */}
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

export default MembersList;
