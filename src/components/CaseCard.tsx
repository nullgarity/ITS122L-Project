import React from "react";
import { Paper, Typography, Box, Button } from "@mui/material";

interface CaseCardProps {
  title: string;
  date: string; 
  lastUpdated: string; 
  category: string;
  onView: () => void;
  onEdit: () => void;
}

const CaseCard: React.FC<CaseCardProps> = ({
  title,
  date,
  lastUpdated,
  category,
  onView,
  onEdit,
}) => {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography fontWeight="bold">{title}</Typography>
      <Typography variant="body2">Created: {new Date(date).toLocaleDateString()}</Typography>
      <Typography variant="body2">Updated: {new Date(lastUpdated).toLocaleString()}</Typography>
      <Typography variant="body2" mt={1}>Category: {category}</Typography>
      <Box display="flex" gap={2} mt={2}>
        <Button variant="outlined" onClick={onView}>View</Button>
        <Button variant="outlined" onClick={onEdit}>Edit</Button>
      </Box>
    </Paper>
  );
};

export default CaseCard;
