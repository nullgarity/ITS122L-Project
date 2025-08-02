// src/pages/user/MyCases.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  TextField,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";

interface CaseItem {
  id: string;
  title: string;
  category: string;
  date: string;
  status?: string;
}

const MyCases: React.FC = () => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data for frontend display (will be replaced with real data later)
  const mockCases: CaseItem[] = [
    {
      id: "1",
      title: "Contract Review - ABC Company",
      category: "Contract Law",
      date: "2025-01-30",
      status: "In Progress",
    },
    {
      id: "2",
      title: "Employment Dispute Resolution",
      category: "Labor Law",
      date: "2025-01-28",
      status: "Pending Review",
    },
    {
      id: "3",
      title: "Intellectual Property Filing",
      category: "IP Law",
      date: "2025-01-25",
      status: "Completed",
    },
  ];

  useEffect(() => {
    // Simulate loading time for frontend display
    setTimeout(() => {
      setCases(mockCases);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const filteredCases = cases.filter(
    (caseItem) =>
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "warning";
      case "Pending Review":
        return "info";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
        <Typography ml={2}>Loading your cases...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Cases
          </Typography>
          <Button color="inherit" onClick={() => navigate("/user/dashboard")}>
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
            label="Search Cases"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />
          <Button
            variant="contained"
            onClick={() => navigate("/user/create-case")}
            sx={{ height: 40 }}
          >
            Create New Case
          </Button>
        </Box>

        {/* Cases Grid */}
        {filteredCases.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary" mb={2}>
              No cases found
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              {searchTerm
                ? "Try adjusting your search terms"
                : "You haven't created any cases yet"}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/user/create-case")}
            >
              Create Your First Case
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredCases.map((caseItem) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={caseItem.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {caseItem.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {caseItem.category}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Created: {new Date(caseItem.date).toLocaleDateString()}
                    </Typography>
                    {caseItem.status && (
                      <Chip
                        label={caseItem.status}
                        color={getStatusColor(caseItem.status) as any}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/user/view-case/${caseItem.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        navigate(`/user/manage-case/${caseItem.id}`)
                      }
                    >
                      Manage
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default MyCases;
