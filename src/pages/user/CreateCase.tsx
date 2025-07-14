import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Paper, MenuItem } from '@mui/material';

const CreateCase = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

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

      {/* Case Creation Form */}
      <Box p={4} bgcolor="#bdbdbd">
        <Typography variant="h6" mb={2}>Create New Case</Typography>
        <Paper elevation={2} sx={{ p: 3, maxWidth: 600 }}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Category"
            select
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            margin="normal"
          >
            <MenuItem value="Criminal">Criminal</MenuItem>
            <MenuItem value="Civil">Civil</MenuItem>
            <MenuItem value="Family">Family</MenuItem>
          </TextField>

          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Upload PDF
          </Button>

          <Box mt={3}>
            <Button variant="contained" color="success">Submit</Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CreateCase;
