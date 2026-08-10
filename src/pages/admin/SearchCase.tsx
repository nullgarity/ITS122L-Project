import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  CircularProgress,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";

interface CaseItem {
  id: string;
  title: string;
  category: string;
  date: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
}

const SearchCase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Initialize search from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const queryParam = searchParams.get("q");

    if (categoryParam) {
      setCategoryFilter(categoryParam);
      performCategorySearch(categoryParam);
    } else if (queryParam) {
      setSearchTerm(queryParam);
      performTextSearch(queryParam);
    }
  }, [searchParams]);

  const performCategorySearch = async (category: string) => {
    setLoading(true);
    try {
      const casesRef = collection(db, "cases");
      const q = query(casesRef, where("category", "==", category));
      const snapshot = await getDocs(q);
      const matches: CaseItem[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        matches.push({
          id: doc.id,
          title: data.title,
          category: data.category,
          date: data.date || data.dateFiled,
          status: data.status || "open",
          priority: data.priority || "Medium",
          assignedTo: data.assignedTo,
        });
      });

      setResults(matches);
    } catch (error) {
      console.error("Category search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const performTextSearch = async (searchText: string) => {
    setLoading(true);
    try {
      const casesRef = collection(db, "cases");
      const q = query(
        casesRef,
        orderBy("title"),
        startAt(searchText),
        endAt(searchText + "\uf8ff")
      );

      const snapshot = await getDocs(q);
      const matches: CaseItem[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        matches.push({
          id: doc.id,
          title: data.title,
          category: data.category,
          date: data.date || data.dateFiled,
          status: data.status || "open",
          priority: data.priority || "Medium",
          assignedTo: data.assignedTo,
        });
      });

      setResults(matches);
    } catch (error) {
      console.error("Text search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    let filtered = results;

    // Apply filters
    if (statusFilter !== "All") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }
    if (categoryFilter !== "All") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }
    if (priorityFilter !== "All") {
      filtered = filtered.filter((item) => item.priority === priorityFilter);
    }

    performTextSearch(searchTerm.trim());
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "in progress":
        return "warning";
      case "pending":
        return "info";
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

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setPriorityFilter("All");
    setResults([]);
  };

  // Apply filters to results
  const filteredResults = results.filter((item) => {
    if (statusFilter !== "All" && item.status !== statusFilter) return false;
    if (categoryFilter !== "All" && item.category !== categoryFilter)
      return false;
    if (priorityFilter !== "All" && item.priority !== priorityFilter)
      return false;
    return true;
  });

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin - Search Cases
          </Typography>
          <Button color="inherit" onClick={() => navigate("/admin/cases")}>
            All Cases
          </Button>
          <Button color="inherit" onClick={() => navigate("/admin/dashboard")}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Search Cases
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3}>
          Search and filter through all cases in the system
        </Typography>

        {/* Search Form */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Search cases by title, category, or content"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Search"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
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
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
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
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="All">All Priorities</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FilterListIcon />}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Results */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
            <Typography ml={2}>Searching cases...</Typography>
          </Box>
        ) : filteredResults.length === 0 &&
          (searchTerm ||
            statusFilter !== "All" ||
            categoryFilter !== "All" ||
            priorityFilter !== "All") ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              No matching cases found.
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Try adjusting your search terms or filters.
            </Typography>
          </Paper>
        ) : filteredResults.length > 0 ? (
          <Grid container spacing={3}>
            {filteredResults.map((item) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={item.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {item.category} •{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </Typography>
                    {item.assignedTo && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        Assigned to: {item.assignedTo}
                      </Typography>
                    )}
                    <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
                      {item.status && (
                        <Chip
                          label={item.status}
                          color={getStatusColor(item.status) as any}
                          size="small"
                        />
                      )}
                      {item.priority && (
                        <Chip
                          label={item.priority}
                          color={getPriorityColor(item.priority) as any}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/admin/view-case/${item.id}`)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/admin/manage-case/${item.id}`)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/admin/view-case/${item.id}`)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              Enter a search term to find cases
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Search by case title, category, or content keywords.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default SearchCase;
