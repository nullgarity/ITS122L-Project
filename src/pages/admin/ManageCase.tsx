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
  Grid,
  TextField,
  Chip,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";

interface CaseItem {
  id: string;
  title: string;
  category: string;
  dateFiled: string;
  status: string;
  priority?: string;
  assignedTo?: string;
  createdAt?: any;
  updatedAt?: any;
}

const ManageCases: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [filteredCases, setFilteredCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const casesRef = collection(db, "cases");
        const q = query(casesRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const casesData: CaseItem[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          casesData.push({
            id: doc.id,
            title: data.title,
            category: data.category,
            dateFiled: data.dateFiled || data.date,
            status: data.status || "Open",
            priority: data.priority || "Medium",
            assignedTo: data.assignedTo,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });

        setCases(casesData);
        setFilteredCases(casesData);
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  useEffect(() => {
    let filtered = cases;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (caseItem) =>
          caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          caseItem.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (caseItem) => caseItem.status === statusFilter
      );
    }

    // Apply category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter(
        (caseItem) => caseItem.category === categoryFilter
      );
    }

    setFilteredCases(filtered);
  }, [cases, searchTerm, statusFilter, categoryFilter]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    caseId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedCase(caseId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCase(null);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "closed":
        return "success";
      case "in progress":
      case "active":
        return "info";
      case "pending":
        return "warning";
      case "open":
        return "primary";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "info";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box>
        <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Admin - Manage Cases
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
          <CircularProgress />
          <Typography ml={2}>Loading cases...</Typography>
        </Box>
      </Box>
    );
  }
  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin - Manage Cases
          </Typography>
          <Button color="inherit" onClick={() => navigate("/admin/dashboard")}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate("/admin/users")}>
            Manage Users
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">
            Manage Cases ({filteredCases.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/create-case")}
          >
            Create New Case
          </Button>
        </Box>

        {/* Filters and Search */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Search Cases"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or category..."
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status Filter"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All Statuses</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Category Filter</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category Filter"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  <MenuItem value="Criminal Law">Criminal Law</MenuItem>
                  <MenuItem value="Civil Law">Civil Law</MenuItem>
                  <MenuItem value="Family Law">Family Law</MenuItem>
                  <MenuItem value="Corporate Law">Corporate Law</MenuItem>
                  <MenuItem value="Constitutional Law">
                    Constitutional Law
                  </MenuItem>
                  <MenuItem value="Labor Law">Labor Law</MenuItem>
                  <MenuItem value="Tax Law">Tax Law</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FilterListIcon />}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setCategoryFilter("All");
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Cases List */}
        {filteredCases.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary" mb={2}>
              No cases found
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              {searchTerm || statusFilter !== "All" || categoryFilter !== "All"
                ? "Try adjusting your search filters"
                : "No cases have been created yet"}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/admin/create-case")}
            >
              Create First Case
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
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={1}
                    >
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{ flexGrow: 1, pr: 1 }}
                      >
                        {caseItem.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, caseItem.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Category: {caseItem.category}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Filed: {new Date(caseItem.dateFiled).toLocaleDateString()}
                    </Typography>

                    {caseItem.assignedTo && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        Assigned to: {caseItem.assignedTo}
                      </Typography>
                    )}

                    <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
                      <Chip
                        label={caseItem.status}
                        color={getStatusColor(caseItem.status) as any}
                        size="small"
                      />
                      {caseItem.priority && (
                        <Chip
                          label={`${caseItem.priority} Priority`}
                          color={getPriorityColor(caseItem.priority) as any}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                    <Button
                      size="small"
                      onClick={() =>
                        navigate(`/admin/view-case/${caseItem.id}`)
                      }
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        navigate(`/admin/manage-case/${caseItem.id}`)
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
              navigate(`/admin/view-case/${selectedCase}`);
              handleMenuClose();
            }}
          >
            View Details
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`/admin/manage-case/${selectedCase}`);
              handleMenuClose();
            }}
          >
            Edit Case
          </MenuItem>
          <MenuItem
            onClick={() => {
              // TODO: Implement duplicate functionality
              handleMenuClose();
            }}
          >
            Duplicate Case
          </MenuItem>
          <MenuItem
            onClick={() => {
              // TODO: Implement archive functionality
              handleMenuClose();
            }}
            sx={{ color: "error.main" }}
          >
            Archive Case
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default ManageCases;
