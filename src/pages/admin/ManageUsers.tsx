import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar,
  TextField,
  Chip,
  Avatar,
  Grid,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department?: string;
  phone?: string;
  status: "Active" | "Inactive" | "Pending";
  lastLogin?: string;
  casesCount?: number;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock users data for frontend display
  const mockUsers: User[] = [
    {
      id: "u1",
      fullName: "Atty. Juan Dela Cruz",
      email: "juan@lawfirm.com",
      role: "Senior Attorney",
      department: "Corporate Law",
      phone: "+63 912 345 6789",
      status: "Active",
      lastLogin: "2025-08-02",
      casesCount: 15,
    },
    {
      id: "u2",
      fullName: "Maria Santos",
      email: "maria@lawfirm.com",
      role: "Legal Assistant",
      department: "Civil Law",
      phone: "+63 917 234 5678",
      status: "Active",
      lastLogin: "2025-08-01",
      casesCount: 8,
    },
    {
      id: "u3",
      fullName: "Ana Reyes",
      email: "ana@lawfirm.com",
      role: "Paralegal",
      department: "Criminal Law",
      phone: "+63 925 345 6789",
      status: "Inactive",
      lastLogin: "2025-07-28",
      casesCount: 3,
    },
    {
      id: "u4",
      fullName: "Carlos Mendoza",
      email: "carlos@lawfirm.com",
      role: "Junior Associate",
      department: "Family Law",
      phone: "+63 918 456 7890",
      status: "Active",
      lastLogin: "2025-08-02",
      casesCount: 12,
    },
    {
      id: "u5",
      fullName: "Lisa Chen",
      email: "lisa@lawfirm.com",
      role: "Legal Researcher",
      department: "IP Law",
      phone: "+63 919 567 8901",
      status: "Pending",
      lastLogin: undefined,
      casesCount: 0,
    },
  ];

  useEffect(() => {
    // Simulate loading time for frontend display
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    userId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department &&
        user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "default";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getRoleColor = (role: string) => {
    if (role.includes("Attorney") || role.includes("Lawyer")) return "#1976d2";
    if (role.includes("Assistant") || role.includes("Paralegal"))
      return "#388e3c";
    if (role.includes("Associate")) return "#f57c00";
    return "#7b1fa2";
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Manage Users
          </Typography>
          <Button color="inherit" onClick={() => navigate("/admin/dashboard")}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        {/* Search and Actions */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <TextField
            label="Search Users"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
            placeholder="Search by name, email, role, or department"
          />
          <Box>
            <Button
              variant="outlined"
              onClick={() => navigate("/admin/search-users")}
              sx={{ mr: 2 }}
            >
              Advanced Search
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/admin/create-user")}
            >
              Add New User
            </Button>
          </Box>
        </Box>

        {/* Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#e3f2fd" }}>
              <Typography variant="h4" color="primary">
                {users.length}
              </Typography>
              <Typography variant="body2">Total Users</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#e8f5e8" }}>
              <Typography variant="h4" color="success.main">
                {users.filter((u) => u.status === "Active").length}
              </Typography>
              <Typography variant="body2">Active Users</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#fff3e0" }}>
              <Typography variant="h4" color="warning.main">
                {users.filter((u) => u.status === "Pending").length}
              </Typography>
              <Typography variant="body2">Pending Approval</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#fafafa" }}>
              <Typography variant="h4" color="textSecondary">
                {users.filter((u) => u.status === "Inactive").length}
              </Typography>
              <Typography variant="body2">Inactive Users</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary" mb={2}>
              No users found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {searchTerm
                ? "Try adjusting your search terms"
                : "No users in the system"}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredUsers.map((userData) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={userData.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: getRoleColor(userData.role),
                            mr: 2,
                            width: 48,
                            height: 48,
                          }}
                        >
                          {userData.fullName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="h2">
                            {userData.fullName}
                          </Typography>
                          <Chip
                            label={userData.status}
                            color={getStatusColor(userData.status) as any}
                            size="small"
                          />
                        </Box>
                      </Box>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, userData.id)}
                        size="small"
                      >
                        ⋮
                      </IconButton>
                    </Box>

                    <Box mb={2}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2" color="textSecondary">
                          📧 {userData.email}
                        </Typography>
                      </Box>
                      {userData.phone && (
                        <Box display="flex" alignItems="center" mb={1}>
                          <Typography variant="body2" color="textSecondary">
                            📞 {userData.phone}
                          </Typography>
                        </Box>
                      )}
                      {userData.department && (
                        <Box display="flex" alignItems="center" mb={1}>
                          <Typography variant="body2" color="textSecondary">
                            🏢 {userData.department}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="primary"
                    >
                      {userData.role}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {userData.casesCount} cases assigned
                    </Typography>
                    {userData.lastLogin && (
                      <Typography variant="caption" color="textSecondary">
                        Last login:{" "}
                        {new Date(userData.lastLogin).toLocaleDateString()}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      onClick={() =>
                        navigate(`/admin/view-user/${userData.id}`)
                      }
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        navigate(`/admin/manage-user/${userData.id}`)
                      }
                    >
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              navigate(`/admin/view-user/${selectedUser}`);
              handleMenuClose();
            }}
          >
            View Details
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`/admin/manage-user/${selectedUser}`);
              handleMenuClose();
            }}
          >
            Edit User
          </MenuItem>
          <MenuItem
            onClick={() => {
              // Handle reset password
              handleMenuClose();
            }}
          >
            Reset Password
          </MenuItem>
          <MenuItem
            onClick={() => {
              // Handle deactivate user
              handleMenuClose();
            }}
          >
            Deactivate User
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default ManageUsers;
