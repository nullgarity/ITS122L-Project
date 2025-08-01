import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  TextField,
} from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const searchQuery = (event.target as HTMLInputElement).value;
      navigate(`/user/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box>
      {/* Top Navigation Bar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        bgcolor="#e0e0e0"
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search Cases (Press Enter)"
          sx={{ width: 250 }}
          onKeyPress={handleSearch}
        />
        <Box display="flex" gap={2} alignItems="center">
          <Typography fontWeight="bold">
            {user?.email ? user.email.split("@")[0] : "User"}
          </Typography>
          <Button onClick={handleLogout}>Log Out</Button>
        </Box>
      </Box>

      {/* Navigation Tabs */}
      <Box
        display="flex"
        justifyContent="center"
        gap={4}
        bgcolor="#9e9e9e"
        py={1}
      >
        <Button
          variant="text"
          onClick={() => handleNavigation("/user/my-cases")}
          sx={{ color: "white" }}
        >
          My Cases
        </Button>
        <Button
          variant="text"
          onClick={() => handleNavigation("/user/categories")}
          sx={{ color: "white" }}
        >
          Categories
        </Button>
        <Button
          variant="contained"
          onClick={() => handleNavigation("/user/create-case")}
          sx={{ bgcolor: "primary.main" }}
        >
          Create New
        </Button>
      </Box>

      {/* Main Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        p={4}
        bgcolor="#bdbdbd"
      >
        {/* Left: Most Recent Case */}
        <Box width="48%">
          <Typography variant="h6" mb={2}>
            Your Most Recent Case
          </Typography>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography fontWeight="bold">
              Welcome to your Dashboard!
            </Typography>
            <Typography variant="body2">
              You have successfully logged in.
            </Typography>
            <Typography variant="body2" mt={1}>
              Start managing your cases here.
            </Typography>
            <Box display="flex" gap={2} mt={2}>
              <Button
                variant="outlined"
                onClick={() => handleNavigation("/user/my-cases")}
              >
                View Cases
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleNavigation("/user/create-case")}
              >
                Create New
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Right: Placeholder Image */}
        <Box
          width="48%"
          height={200}
          border={1}
          borderColor="#000"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body2">Dashboard Image Placeholder</Typography>
        </Box>
      </Box>

      {/* Bottom Cards - Quick Actions */}
      <Box display="flex" justifyContent="space-between" px={4} pb={4}>
        <Paper
          elevation={2}
          sx={{
            width: "48%",
            height: 120,
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
          onClick={() => handleNavigation("/user/search")}
        >
          <Typography variant="h6" mb={1}>
            Quick Search
          </Typography>
          <Typography variant="body2">
            Search through all cases quickly
          </Typography>
        </Paper>
        <Paper
          elevation={2}
          sx={{
            width: "48%",
            height: 120,
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
          onClick={() => handleNavigation("/user/categories")}
        >
          <Typography variant="h6" mb={1}>
            Browse Categories
          </Typography>
          <Typography variant="body2">Explore cases by category</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
