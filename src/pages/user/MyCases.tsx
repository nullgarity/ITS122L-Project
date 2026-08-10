import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Grid,
  TextField,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";
import CaseCard from "../../components/CaseCard";

interface CaseItem {  
  id: string;
  title: string;
  category: string;
  dateFiled: string;
  status: string;
  lastUpdated?: string;
}

const MyCases: React.FC = () => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const mockCases: CaseItem[] = [
    {
      id: "1",
      title: "Contract Review - ABC Company",
      category: "Contract Law",
      dateFiled: "2025-01-30",
      status: "In Progress",
    },
    {
      id: "2",
      title: "Employment Dispute Resolution",
      category: "Labor Law",
      dateFiled: "2025-01-28",
      status: "Pending Review",
    },
    {
      id: "3",
      title: "Intellectual Property Filing",
      category: "IP Law",
      dateFiled: "2025-01-25",
      status: "Completed",
    },
  ];

  useEffect(() => {
    // Simulate loading
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
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
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
        {/* Search + Action */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <TextField
            label="Search Cases"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />
          <Button variant="contained" onClick={() => navigate("/user/create-case")} sx={{ height: 40 }}>
            Create New Case
          </Button>
        </Box>

        {/* Case List */}
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
            <Button variant="contained" onClick={() => navigate("/user/create-case")}>
              Create Your First Case
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredCases.map((caseItem) => (
              <Grid item xs={12} md={6} lg={4} key={caseItem.id}>
                <CaseCard
                  title={caseItem.title}
                  category={caseItem.category}
                  dateFiled={caseItem.dateFiled}
                  status={caseItem.status}
                  lastUpdated={caseItem.lastUpdated}
                  onView={() => navigate(`/user/view-case/${caseItem.id}`)}
                  onEdit={() => navigate(`/user/manage-case/${caseItem.id}`)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default MyCases;

