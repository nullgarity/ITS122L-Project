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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminCases: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [filteredCases, setFilteredCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

    if (searchTerm) {
      filtered = filtered.filter(
        (caseItem) =>
          caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          caseItem.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          caseItem.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (caseItem) => caseItem.status === statusFilter
      );
    }

    setFilteredCases(filtered);
  }, [searchTerm, statusFilter, cases]);

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
      case "closed":
        return "default";
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

  const getStatusCount = (status: string) => {
    return cases.filter((c) => c.status.toLowerCase() === status.toLowerCase())
      .length;
  };

  if (loading) {
    return (
      <Box>
        <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Admin - Cases Management
            </Typography>
            <Button
              color="inherit"
              onClick={() => navigate("/admin/dashboard")}
            >
              Dashboard
            </Button>
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
            Admin - Cases Management
          </Typography>
          <Button color="inherit" onClick={() => navigate("/admin/dashboard")}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate("/admin/users")}>
            Users
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        {/* Page Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              Cases Management
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage all cases in the system - view, edit, assign, and track
              progress
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/create-case")}
            size="large"
          >
            Create New Case
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ bgcolor: "#e3f2fd" }}>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {cases.length}
                </Typography>
                <Typography variant="body1">Total Cases</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ bgcolor: "#fff3e0" }}>
              <CardContent>
                <Typography variant="h4" color="warning.main">
                  {getStatusCount("Open")}
                </Typography>
                <Typography variant="body1">Open Cases</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ bgcolor: "#e8f5e8" }}>
              <CardContent>
                <Typography variant="h4" color="success.main">
                  {getStatusCount("Completed")}
                </Typography>
                <Typography variant="body1">Completed</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ bgcolor: "#f3e5f5" }}>
              <CardContent>
                <Typography variant="h4" color="info.main">
                  {getStatusCount("In Progress")}
                </Typography>
                <Typography variant="body1">In Progress</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab
              label={
                <Badge badgeContent={cases.length} color="primary">
                  All Cases
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={getStatusCount("Open")} color="warning">
                  Open Cases
                </Badge>
              }
            />
            <Tab label="Reports" />
          </Tabs>

          {/* All Cases Tab */}
          <TabPanel value={tabValue} index={0}>
            {/* Search and Filters */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Search cases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<FilterListIcon />}
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("All");
                    }}
                  >
                    Clear Filters
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Cases Table */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Case Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Date Filed</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCases.map((caseItem) => (
                    <TableRow key={caseItem.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {caseItem.title}
                        </Typography>
                      </TableCell>
                      <TableCell>{caseItem.category}</TableCell>
                      <TableCell>
                        <Chip
                          label={caseItem.status}
                          color={getStatusColor(caseItem.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={caseItem.priority || "Medium"}
                          color={
                            getPriorityColor(
                              caseItem.priority || "Medium"
                            ) as any
                          }
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(caseItem.dateFiled).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {caseItem.assignedTo || "Unassigned"}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(`/admin/view-case/${caseItem.id}`)
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(`/admin/manage-case/${caseItem.id}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, caseItem.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredCases.length === 0 && (
              <Paper sx={{ p: 4, textAlign: "center", mt: 3 }}>
                <Typography variant="h6" color="textSecondary" mb={2}>
                  No cases found
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={3}>
                  {searchTerm || statusFilter !== "All"
                    ? "Try adjusting your search or filter criteria"
                    : "No cases have been created yet"}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/admin/create-case")}
                >
                  Create First Case
                </Button>
              </Paper>
            )}
          </TabPanel>

          {/* Open Cases Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {cases
                .filter((c) => c.status.toLowerCase() === "open")
                .map((caseItem) => (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }} key={caseItem.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {caseItem.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          gutterBottom
                        >
                          {caseItem.category}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Filed:{" "}
                          {new Date(caseItem.dateFiled).toLocaleDateString()}
                        </Typography>
                        <Box mt={2}>
                          <Chip
                            label={caseItem.priority || "Medium"}
                            color={
                              getPriorityColor(
                                caseItem.priority || "Medium"
                              ) as any
                            }
                            size="small"
                          />
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() =>
                            navigate(`/admin/view-case/${caseItem.id}`)
                          }
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            navigate(`/admin/manage-case/${caseItem.id}`)
                          }
                        >
                          Manage
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </TabPanel>

          {/* Reports Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Case Statistics
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Total Cases:</Typography>
                      <Typography fontWeight="bold">{cases.length}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Open Cases:</Typography>
                      <Typography fontWeight="bold">
                        {getStatusCount("Open")}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>In Progress:</Typography>
                      <Typography fontWeight="bold">
                        {getStatusCount("In Progress")}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Completed:</Typography>
                      <Typography fontWeight="bold">
                        {getStatusCount("Completed")}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3, textAlign: "center" }}>
                  <AssessmentIcon
                    sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Advanced Reports
                  </Typography>
                  <Typography variant="body2" color="textSecondary" mb={3}>
                    Detailed analytics and reporting features coming soon
                  </Typography>
                  <Button variant="outlined" disabled>
                    Generate Report
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>

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
              // TODO: Implement assign functionality
              handleMenuClose();
            }}
          >
            Assign Case
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

export default AdminCases;
