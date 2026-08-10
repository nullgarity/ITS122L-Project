import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Grid,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";

interface UserDetails {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  status: "Active" | "Inactive" | "Pending";
  joinDate: string;
  lastLogin: string;
  casesCount: number;
  address: string;
  emergencyContact: string;
  skills: string[];
}

interface UserCase {
  id: string;
  title: string;
  category: string;
  status: string;
  dateFiled: string;
  lastUpdated: string;
  priority: "High" | "Medium" | "Low";
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
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ViewUser: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userCases, setUserCases] = useState<UserCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  // Mock user details
  const mockUserDetails: UserDetails = {
    id: id || "u1",
    fullName: "Atty. Juan Dela Cruz",
    email: "juan@lawfirm.com",
    role: "Senior Attorney",
    department: "Corporate Law",
    phone: "+63 912 345 6789",
    status: "Active",
    joinDate: "2022-03-15",
    lastLogin: "2025-08-02T10:30:00",
    casesCount: 15,
    address: "123 Legal St., Makati City, Philippines",
    emergencyContact: "+63 917 123 4567",
    skills: [
      "Contract Law",
      "Corporate Governance",
      "Mergers & Acquisitions",
      "Legal Research",
    ],
  };

  // Mock user cases
  const mockUserCases: UserCase[] = [
    {
      id: "c1",
      title: "ABC Corp Merger Agreement",
      category: "Corporate Law",
      status: "In Progress",
      dateFiled: "2025-07-15",
      lastUpdated: "2025-08-01",
      priority: "High",
    },
    {
      id: "c2",
      title: "XYZ Contract Review",
      category: "Contract Law",
      status: "Completed",
      dateFiled: "2025-06-20",
      lastUpdated: "2025-07-28",
      priority: "Medium",
    },
    {
      id: "c3",
      title: "Legal Compliance Audit",
      category: "Compliance",
      status: "Pending Review",
      dateFiled: "2025-07-30",
      lastUpdated: "2025-08-02",
      priority: "Medium",
    },
  ];

  useEffect(() => {
    // Simulate loading time for frontend display
    setTimeout(() => {
      setUserDetails(mockUserDetails);
      setUserCases(mockUserCases);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "default";
      case "Pending":
        return "warning";
      case "In Progress":
        return "info";
      case "Completed":
        return "success";
      case "Pending Review":
        return "warning";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  if (loading || !userDetails) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Loading user details...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Details - {userDetails.fullName}
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
        {/* User Profile Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 2 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "#1976d2",
                  fontSize: "2rem",
                  mx: "auto",
                }}
              >
                {userDetails.fullName.charAt(0)}
              </Avatar>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h4" gutterBottom>
                {userDetails.fullName}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                {userDetails.role}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {userDetails.department}
              </Typography>
              <Box display="flex" gap={1} mb={2}>
                <Chip
                  label={userDetails.status}
                  color={getStatusColor(userDetails.status) as any}
                />
                <Chip
                  label={`${userDetails.casesCount} Cases`}
                  variant="outlined"
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  variant="contained"
                  onClick={() =>
                    navigate(`/admin/manage-user/${userDetails.id}`)
                  }
                  fullWidth
                >
                  Edit User
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/admin/users`)}
                  fullWidth
                >
                  Reset Password
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Personal Information" />
            <Tab label="Cases" />
            <Tab label="Activity Log" />
          </Tabs>

          {/* Personal Information Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Email"
                      secondary={userDetails.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Phone"
                      secondary={userDetails.phone}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Address"
                      secondary={userDetails.address}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Emergency Contact"
                      secondary={userDetails.emergencyContact}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" gutterBottom>
                  Employment Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Join Date"
                      secondary={new Date(
                        userDetails.joinDate
                      ).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Last Login"
                      secondary={new Date(
                        userDetails.lastLogin
                      ).toLocaleString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Department"
                      secondary={userDetails.department}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Status"
                      secondary={userDetails.status}
                    />
                  </ListItem>
                </List>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Skills & Expertise
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {userDetails.skills.map((skill, index) => (
                    <Chip key={index} label={skill} variant="outlined" />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Cases Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Assigned Cases ({userCases.length})
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Case Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Date Filed</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userCases.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell>{caseItem.title}</TableCell>
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
                          label={caseItem.priority}
                          color={getPriorityColor(caseItem.priority) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(caseItem.dateFiled).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(caseItem.lastUpdated).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() =>
                            navigate(`/admin/view-case/${caseItem.id}`)
                          }
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Activity Log Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1" color="textSecondary">
                Activity logs will be displayed here.
                <br />
                This will include login history, case actions, and system
                events.
              </Typography>
            </Paper>
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  );
};

export default ViewUser;
