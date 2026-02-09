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
import { Edit, Delete, Search, Add } from '@mui/icons-material';

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
    columns.some((column) =>
      String(item[column.field] || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderCellValue = (item, column) => {
    const value = item[column.field];

    if (column.render) {
      return column.render(value, item);
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field} sx={{ fontWeight: 'bold' }}>
                  {column.headerName}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
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
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {renderCellValue(item, column)}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      {onEdit && (
                        <IconButton
                          color="primary"
                          onClick={() => onEdit(item)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          color="error"
                          onClick={() => onDelete(item)}
                          size="small"
                        >
                          <Delete />
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
