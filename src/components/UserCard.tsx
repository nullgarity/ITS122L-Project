import React from "react";
import { Paper, Typography, Button, Box, Stack, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

interface UserCardProps {
  fullName: string;
  email: string;
  role: string;
  onManage: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ fullName, email, role, onManage }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: "#f9f9f9" }}>
      <Stack spacing={1} alignItems="center">
        <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
          <PersonIcon />
        </Avatar>
        <Typography variant="h6" fontWeight="bold" align="center">
          {fullName}
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          {email}
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          Role: {role}
        </Typography>
        <Box mt={2}>
          <Button variant="contained" size="small" onClick={onManage}>
            Manage User
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default UserCard;