import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { 
  Search as SearchIcon,
  Cases as CaseIcon,
  Create as CreateIcon,
  Category as CategoryIcon,
  Dashboard as DashboardIcon 
} from "@mui/icons-material";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      navigate(`/user/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/user/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Mock user statistics for display
  const userStats = {
    myCases: 8,
    inProgress: 3,
    completed: 5,
    recentlyViewed: 12,
  };

  const quickActions = [
    {
      title: "My Cases",
      description: "View and manage your submitted cases",
      action: () => navigate("/user/my-cases"),
      color: "#e3f2fd",
      count: userStats.myCases,
      icon: <CaseIcon />,
    },
    {
      title: "Search Cases",
      description: "Search through all available cases",
      action: () => navigate("/user/search"),
      color: "#e8f5e8",
      count: null,
      icon: <SearchIcon />,
    },
    {
      title: "Browse Categories",
      description: "Explore cases by category",
      action: () => navigate("/user/categories"),
      color: "#fff3e0",
      count: null,
      icon: <CategoryIcon />,
    },
    {
      title: "Create New Case",
      description: "Submit a new case to the system",
      action: () => navigate("/user/create-case"),
      color: "#f3e5f5",
      count: null,
      icon: <CreateIcon />,
    },
  ];

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.email ? user.email.split("@")[0] : "User"}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        {/* Search Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Your Dashboard
          </Typography>
          
          <Paper sx={{ p: 3, mb: 3, bgcolor: "#f5f5f5" }}>
            <Typography variant="h6" gutterBottom>
              Quick Search
            </Typography>
            <TextField
              fullWidth
              placeholder="Search cases, categories, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearchClick} edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: "white" }}
            />
          </Paper>
        </Box>

        {/* User Statistics */}
        <Typography variant="h5" gutterBottom>
          Your Activity Overview
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#e3f2fd" }}>
              <Typography variant="h3" color="primary">
                {userStats.myCases}
              </Typography>
              <Typography variant="body1">My Cases</Typography>
              <Chip
                label={`${userStats.inProgress} Active`}
                size="small"
                color="primary"
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#e8f5e8" }}>
              <Typography variant="h3" color="success.main">
                {userStats.completed}
              </Typography>
              <Typography variant="body1">Completed</Typography>
              <Chip
                label="Resolved"
                size="small"
                color="success"
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#fff3e0" }}>
              <Typography variant="h3" color="warning.main">
                {userStats.inProgress}
              </Typography>
              <Typography variant="body1">In Progress</Typography>
              <Chip label="Pending" size="small" color="warning" />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#ffebee" }}>
              <Typography variant="h3" color="text.secondary">
                {userStats.recentlyViewed}
              </Typography>
              <Typography variant="body1">Recently Viewed</Typography>
              <Chip label="This Week" size="small" color="default" />
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
                  <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                    {action.icon}
                  </Box>
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
            <Typography variant="body1" color="textSecondary" textAlign="center">
              Your recent case activities and updates will be displayed here.
              <br />
              This includes case submissions, status updates, and system notifications.
            </Typography>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate("/user/my-cases")}
                sx={{ mr: 2 }}
              >
                View My Cases
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate("/user/create-case")}
              >
                Create New Case
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
