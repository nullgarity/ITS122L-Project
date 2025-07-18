import React from 'react';
import { Box, Typography, Button, TextField, Paper } from '@mui/material';

const ManageCase = () => {
  return (
    <Box>
      {/* Top Navigation Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="#e0e0e0">
        <TextField variant="outlined" size="small" placeholder="Search Cases" sx={{ width: 200 }} />
        <Box display="flex" gap={2} alignItems="center">
          <Typography fontWeight="bold">Admin LastName</Typography>
          <Button>Log Out</Button>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box display="flex" justifyContent="center" gap={4} bgcolor="#9e9e9e" py={1}>
        <Button variant="contained">Manage Cases</Button>
        <Button variant="text">Manage Users</Button>
      </Box>

      {/* Case Management Table */}
      <Box p={4} bgcolor="#bdbdbd">
        <Typography variant="h6" mb={2}>All Submitted Cases</Typography>
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Typography fontWeight="bold">Case Title A</Typography>
          <Typography variant="body2">05/06/2025</Typography>
          <Typography variant="body2" mt={1}>Category: Criminal</Typography>
          <Box display="flex" gap={2} mt={2}>
            <Button variant="outlined">View</Button>
            <Button variant="outlined">Edit</Button>
          </Box>
        </Paper>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography fontWeight="bold">Case Title B</Typography>
          <Typography variant="body2">04/15/2025</Typography>
          <Typography variant="body2" mt={1}>Category: Civil</Typography>
          <Box display="flex" gap={2} mt={2}>
            <Button variant="outlined">View</Button>
            <Button variant="outlined">Edit</Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ManageCase;
