import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Inactive" | "Pending";
  joinDate: string;
  casesCount: number;
}

interface SearchFilters {
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  joinDateFrom: string;
  joinDateTo: string;
}

const SearchUsers: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    name: "",
    email: "",
    role: "",
    department: "",
    status: "",
    joinDateFrom: "",
    joinDateTo: "",
  });

  // Mock search results
  const mockUsers: User[] = [
    {
      id: "u1",
      fullName: "Atty. Juan Dela Cruz",
      email: "juan@lawfirm.com",
      role: "Senior Attorney",
      department: "Corporate Law",
      status: "Active",
      joinDate: "2022-03-15",
      casesCount: 15,
    },
    {
      id: "u2",
      fullName: "Maria Santos",
      email: "maria@lawfirm.com",
      role: "Legal Assistant",
      department: "Civil Law",
      status: "Active",
      joinDate: "2023-01-10",
      casesCount: 8,
    },
    {
      id: "u3",
      fullName: "Carlos Mendoza",
      email: "carlos@lawfirm.com",
      role: "Junior Associate",
      department: "Family Law",
      status: "Pending",
      joinDate: "2025-07-15",
      casesCount: 3,
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setSearching(true);
    setHasSearched(true);

    // Simulate search delay
    setTimeout(() => {
      // Filter mock users based on search criteria
      let results = mockUsers.filter((user) => {
        const matchesName =
          !filters.name ||
          user.fullName.toLowerCase().includes(filters.name.toLowerCase());
        const matchesEmail =
          !filters.email ||
          user.email.toLowerCase().includes(filters.email.toLowerCase());
        const matchesRole = !filters.role || user.role === filters.role;
        const matchesDepartment =
          !filters.department || user.department === filters.department;
        const matchesStatus = !filters.status || user.status === filters.status;

        return (
          matchesName &&
          matchesEmail &&
          matchesRole &&
          matchesDepartment &&
          matchesStatus
        );
      });

      setSearchResults(results);
      setSearching(false);
    }, 1000);
  };

  const handleClearFilters = () => {
    setFilters({
      name: "",
      email: "",
      role: "",
      department: "",
      status: "",
      joinDateFrom: "",
      joinDateTo: "",
    });
    setSearchResults([]);
    setHasSearched(false);
  };

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
            Search Users
          </Typography>
          <Button color="inherit" onClick={() => navigate("/admin/users")}>
            Back to Users
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
        {/* Search Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Advanced User Search
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                placeholder="Search by name..."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={filters.email}
                onChange={(e) => handleFilterChange("email", e.target.value)}
                placeholder="Search by email..."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={filters.role}
                  label="Role"
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="Senior Attorney">Senior Attorney</MenuItem>
                  <MenuItem value="Junior Associate">Junior Associate</MenuItem>
                  <MenuItem value="Legal Assistant">Legal Assistant</MenuItem>
                  <MenuItem value="Paralegal">Paralegal</MenuItem>
                  <MenuItem value="Legal Researcher">Legal Researcher</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={filters.department}
                  label="Department"
                  onChange={(e) =>
                    handleFilterChange("department", e.target.value)
                  }
                >
                  <MenuItem value="">All Departments</MenuItem>
                  <MenuItem value="Corporate Law">Corporate Law</MenuItem>
                  <MenuItem value="Civil Law">Civil Law</MenuItem>
                  <MenuItem value="Criminal Law">Criminal Law</MenuItem>
                  <MenuItem value="Family Law">Family Law</MenuItem>
                  <MenuItem value="IP Law">IP Law</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Pending">Pending Approval</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Advanced Filters */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary>
              <Typography>Advanced Filters</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Join Date From"
                    type="date"
                    value={filters.joinDateFrom}
                    onChange={(e) =>
                      handleFilterChange("joinDateFrom", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Join Date To"
                    type="date"
                    value={filters.joinDateTo}
                    onChange={(e) =>
                      handleFilterChange("joinDateTo", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Search Actions */}
          <Box display="flex" gap={2} mt={3}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={searching}
              sx={{ minWidth: 120 }}
            >
              {searching ? "Searching..." : "Search Users"}
            </Button>
            <Button variant="outlined" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Box>
        </Paper>

        {/* Search Results */}
        {hasSearched && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Search Results ({searchResults.length} users found)
            </Typography>

            {searchResults.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="textSecondary">
                  No users found matching your search criteria.
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Try adjusting your filters or search terms.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {searchResults.map((userData) => (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }} key={userData.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box display="flex" alignItems="center" mb={2}>
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

                        <Typography
                          variant="body2"
                          color="textSecondary"
                          gutterBottom
                        >
                          📧 {userData.email}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          gutterBottom
                        >
                          🏢 {userData.department}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="primary"
                        >
                          {userData.role}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {userData.casesCount} cases • Joined{" "}
                          {new Date(userData.joinDate).toLocaleDateString()}
                        </Typography>
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
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default SearchUsers;
