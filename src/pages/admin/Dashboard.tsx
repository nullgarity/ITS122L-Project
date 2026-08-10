import React from "react";
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
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Mock statistics for frontend display
  const stats = {
    totalUsers: 24,
    activeUsers: 18,
    totalCases: 156,
    pendingCases: 12,
    completedCases: 89,
    inProgressCases: 55,
  };

  const quickActions = [
    {
      title: "Manage Users",
      description: "View, search, and manage user accounts",
      action: () => navigate("/admin/users"),
      color: "#e3f2fd",
      count: stats.totalUsers,
    },
    {
      title: "Manage Cases",
      description: "View and manage all cases in the system",
      action: () => navigate("/admin/cases"),
      color: "#e8f5e8",
      count: stats.totalCases,
    },
    {
      title: "Create New Case",
      description: "Create a new case entry",
      action: () => navigate("/admin/create-case"),
      color: "#fff3e0",
      count: null,
    },
    {
      title: "Search Users",
      description: "Advanced user search and filtering",
      action: () => navigate("/admin/search-users"),
      color: "#f3e5f5",
      count: null,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.email ? user.email.split("@")[0] : "Admin"}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        {/* Statistics Overview */}
        <Typography variant="h4" gutterBottom>
          System Overview
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#e3f2fd" }}>
              <Typography variant="h3" color="primary">
                {stats.totalUsers}
              </Typography>
              <Typography variant="body1">Total Users</Typography>
              <Chip
                label={`${stats.activeUsers} Active`}
                size="small"
                color="success"
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#e8f5e8" }}>
              <Typography variant="h3" color="success.main">
                {stats.totalCases}
              </Typography>
              <Typography variant="body1">Total Cases</Typography>
              <Chip
                label={`${stats.completedCases} Completed`}
                size="small"
                color="success"
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#fff3e0" }}>
              <Typography variant="h3" color="warning.main">
                {stats.inProgressCases}
              </Typography>
              <Typography variant="body1">In Progress</Typography>
              <Chip label="Active" size="small" color="warning" />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#ffebee" }}>
              <Typography variant="h3" color="error.main">
                {stats.pendingCases}
              </Typography>
              <Typography variant="body1">Pending Review</Typography>
              <Chip label="Needs Attention" size="small" color="error" />
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Quick Actions */}
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>

        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: action.color,
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                }}
                onClick={action.action}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 3 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {action.title}
                  </Typography>
                  {action.count && (
                    <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                      {action.count}
                    </Typography>
                  )}
                  <Typography variant="body2" color="textSecondary">
                    {action.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                  <Button size="small" variant="contained">
                    Access
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Recent Activity
          </Typography>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="body1"
              color="textSecondary"
              textAlign="center"
            >
              Recent system activities will be displayed here.
              <br />
              This will include user registrations, case submissions, and system
              updates.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
