import React from 'react';
import { Box, Typography, Button, Paper, Grid, Divider, TextField } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      {/* Top Navigation Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="#e0e0e0">
        <TextField variant="outlined" size="small" placeholder="Search Cases" sx={{ width: 200 }} />
        <Box display="flex" gap={2} alignItems="center">
          <Typography fontWeight="bold">Lawyer LastName</Typography>
          <Button>Log Out</Button>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box display="flex" justifyContent="center" gap={4} bgcolor="#9e9e9e" py={1}>
        <Button variant="text">My Cases</Button>
        <Button variant="text">Categories</Button>
        <Button variant="contained">Create New</Button>
      </Box>

      {/* Main Section */}
      <Box display="flex" justifyContent="space-between" p={4} bgcolor="#bdbdbd">
        {/* Left: Most Recent Case */}
        <Box width="48%">
          <Typography variant="h6" mb={2}>Your Most Recent Case</Typography>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography fontWeight="bold">Lorem ipsum dolor sit amet</Typography>
            <Typography variant="body2">05/07/2025</Typography>
            <Typography variant="body2" mt={1}>Categories: consectetur adipiscing elit</Typography>
            <Box display="flex" gap={2} mt={2}>
              <Button variant="outlined">View</Button>
              <Button variant="outlined">Edit</Button>
            </Box>
          </Paper>
        </Box>

        {/* Right: Placeholder Image */}
        <Box width="48%" height={200} border={1} borderColor="#000" display="flex" justifyContent="center" alignItems="center">
          <Typography variant="body2">Image Placeholder</Typography>
        </Box>
      </Box>

      {/* Bottom Cards (Placeholders) */}
      <Box display="flex" justifyContent="space-between" px={4} pb={4}>
        <Paper elevation={2} sx={{ width: '48%', height: 100 }} />
        <Paper elevation={2} sx={{ width: '48%', height: 100 }} />
      </Box>
    </Box>
  );
};

export default Dashboard;
