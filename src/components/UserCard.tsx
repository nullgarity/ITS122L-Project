import React from "react";
import { Paper, Typography, Button, Box } from "@mui/material";

interface UserCardProps {
  fullName: string;
  email: string;
  role: string;
  onManage: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ fullName, email, role, onManage }) => {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="bold">{fullName}</Typography>
      <Typography variant="body2">{email}</Typography>
      <Typography variant="body2" color="text.secondary">Role: {role}</Typography>
      <Box mt={2}>
        <Button variant="outlined" onClick={onManage}>Manage</Button>
      </Box>
    </Paper>
  );
};

export default UserCard;
