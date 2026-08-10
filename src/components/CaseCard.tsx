import React from "react";
import { Paper, Typography, Box, Button, Stack, Divider, Chip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

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
  onEdit,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: "#fafafa" }}>
      <Stack spacing={1}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#1e88e5" }}>
          {title}
        </Typography>
        <Divider />
        <Typography variant="body2" color="textSecondary">
          Filed on: {new Date(dateFiled).toLocaleDateString()}
        </Typography>
        {lastUpdated && (
          <Typography variant="body2" color="textSecondary">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </Typography>
        )}
        {category && (
          <Typography variant="body2" color="textSecondary">
            Category: {category}
          </Typography>
        )}
        <Chip label={`Status: ${status}`} color="primary" variant="outlined" size="small" />
        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
          {onView && (
            <Button variant="contained" size="small" onClick={onView} startIcon={<DescriptionIcon />}>
              View
            </Button>
          )}
          {onEdit && (
            <Button variant="outlined" size="small" onClick={onEdit}>
              Edit
            </Button>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default CaseCard;