import React from "react";
import { Paper, Typography, Box, Button } from "@mui/material";

interface CaseCardProps {
  title: string;
  dateFiled: string;
  status: string;
  onView?: () => void;
  lastUpdated?: string;
  category?: string;
  onEdit?: () => void;
}

const CaseCard: React.FC<CaseCardProps> = ({
  title,
  dateFiled,
  status,
  lastUpdated,
  category,
  onView,
  onEdit
}) => {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" fontWeight="bold">{title}</Typography>
      <Typography variant="body2">Filed: {new Date(dateFiled).toLocaleDateString()}</Typography>
      {lastUpdated && (
        <Typography variant="body2">Updated: {new Date(lastUpdated).toLocaleString()}</Typography>
      )}
      {category && (
        <Typography variant="body2">Category: {category}</Typography>
      )}
      <Typography variant="body2" color="text.secondary">Status: {status}</Typography>
      <Box display="flex" gap={2} mt={2}>
        {onView && <Button variant="outlined" onClick={onView}>View Case</Button>}
        {onEdit && <Button variant="outlined" onClick={onEdit}>Edit</Button>}
      </Box>
    </Paper>
  );
};

export default CaseCard;