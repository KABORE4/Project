import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Button,
} from '@mui/material';
import { Edit, Delete, Search, Add, Block, CheckCircle } from '@mui/icons-material';

const DataTable = ({
  title,
  columns,
  data,
  onEdit,
  onDelete,
  onAdd,
  searchPlaceholder = 'Search...',
  addButtonText = 'Add New',
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = (Array.isArray(data) ? data : []).filter((item) =>
    columns.some((column) => {
      const value = item[column.field];
      return String(value || '').toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const renderCellValue = (item, column) => {
    const value = item[column.field];

    if (column.renderCell) {
      return column.renderCell({ value, row: item });
    }

    if (column.type === 'status') {
      return (
        <Chip
          label={value}
          color={value === 'active' || value === 'available' || value === 'completed' ? 'success' :
                value === 'inactive' || value === 'maintenance' ? 'warning' :
                value === 'pending' ? 'info' : 'error'}
          size="small"
        />
      );
    }

    if (column.type === 'date') {
      return new Date(value).toLocaleDateString();
    }

    if (column.type === 'currency') {
      return `$${Number(value).toLocaleString()}`;
    }

    if (column.type === 'number') {
      return Number(value).toLocaleString();
    }

    return value;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        {onAdd && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAdd}
          >
            {addButtonText}
          </Button>
        )}
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper} sx={{ 
        maxHeight: 'calc(100vh - 250px)', 
        overflow: 'auto',
        width: '100%',
        '&::-webkit-scrollbar': {
          height: '6px',
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        }
      }}>
        <Table stickyHeader size="small" sx={{ 
          width: '100%',
          tableLayout: 'fixed'
        }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.field} 
                  sx={{ 
                    fontWeight: 'bold', 
                    width: column.width || '100px',
                    fontSize: '0.875rem',
                    padding: '8px 12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell sx={{ fontWeight: 'bold', width: '120px', fontSize: '0.875rem', padding: '8px 12px' }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id || item._id}>
                  {columns.map((column) => (
                    <TableCell 
                      key={column.field}
                      sx={{ 
                        width: column.width || '100px',
                        fontSize: '0.875rem',
                        padding: '8px 12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {renderCellValue(item, column)}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell sx={{ width: '120px', padding: '8px 12px' }}>
                      {onEdit && (
                        <IconButton
                          color="primary"
                          onClick={() => onEdit(item)}
                          size="small"
                          sx={{ padding: '4px' }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          color={item.status === 'active' ? 'success' : 'warning'}
                          onClick={() => {
                            // Créer une copie propre pour éviter XrayWrapper
                            console.log('Current item status:', item.status); // Debug
                            const cleanItem = JSON.parse(JSON.stringify(item));
                            const newStatus = cleanItem.status === 'active' ? 'inactive' : 'active';
                            console.log('New status will be:', newStatus); // Debug
                            const updatedItem = {
                              ...cleanItem,
                              status: newStatus
                            };
                            console.log('Calling onDelete with:', updatedItem); // Debug
                            onDelete(updatedItem);
                          }}
                          size="small"
                          title={item.status === 'active' ? 'Disable Member' : 'Enable Member'}
                          sx={{ padding: '4px' }}
                        >
                          {item.status === 'active' ? <CheckCircle fontSize="small" /> : <Block fontSize="small" />}
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DataTable;
