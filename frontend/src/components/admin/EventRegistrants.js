import React, { useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TextField, Typography } from '@mui/material';

const EventRegistrants = () => {
  const [search, setSearch] = useState('');

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
          Registrants
        </Typography>
        <TextField
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by username or email..."
          variant="outlined"
          size="small"
          sx={{ mb: 2, width: 320 }}
        />
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, minWidth: 500 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* No data rows */}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default EventRegistrants;
