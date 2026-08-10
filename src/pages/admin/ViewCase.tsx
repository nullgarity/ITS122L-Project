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
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Flag as FlagIcon,
  AttachFile as AttachFileIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";

interface CaseData {
  id: string;
  caseNumber: string;
  caseTitle: string;
  caseType: string;
  status: string;
  authorizedUsers: string[];
  fileIds: string[];
  filedBy: string;
  dateFiled: Timestamp;
  lastUpdated: Timestamp;
  participants: {
    plaintiff: string;
    defendant: string;
  };
  priority?: string;
  assignedTo?: string;
  description?: string;
}

interface CaseFile {
  id: string;
  fileName: string;
  url: string;
  uploadedAt: any;
}

const ViewCase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [caseFiles, setCaseFiles] = useState<CaseFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [newAssignee, setNewAssignee] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchCaseData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const caseDoc = await getDoc(doc(db, "cases", id));
        if (caseDoc.exists()) {
          const caseInfo = { id: caseDoc.id, ...caseDoc.data() } as CaseData;
          setCaseData(caseInfo);
          setNewStatus(caseInfo.status || "Open");
          setNewPriority(caseInfo.priority || "Medium");
          setNewAssignee(caseInfo.assignedTo || "");
        } else {
          setError("Case not found");
        }

        const filesQuery = query(
          collection(db, "caseFiles"),
          where("caseId", "==", id)
        );
        const filesSnapshot = await getDocs(filesQuery);
        const files: CaseFile[] = [];
        filesSnapshot.forEach((doc) => {
          files.push({ id: doc.id, ...doc.data() } as CaseFile);
        });
        setCaseFiles(files);
      } catch (err) {
        console.error("Error fetching case data:", err);
        setError("Failed to load case data");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseData();
  }, [id]);

  const handleUpdateCase = async () => {
    if (!id || !caseData) return;

    try {
      await updateDoc(doc(db, "cases", id), {
        status: newStatus,
        priority: newPriority,
        assignedTo: newAssignee,
        lastUpdated: Timestamp.now(),
      });

      setCaseData({
        ...caseData,
        status: newStatus,
        priority: newPriority,
        assignedTo: newAssignee,
        lastUpdated: Timestamp.now(),
      });

      setEditDialogOpen(false);
    } catch (err) {
      console.error("Error updating case:", err);
    }
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

  if (loading) {
    return (
      <Box>
        <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Admin - View Case
            </Typography>
            <Button color="inherit" onClick={() => navigate("/admin/cases")}>
              Back to Cases
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
          <CircularProgress />
          <Typography ml={2}>Loading case details...</Typography>
        </Box>
      </Box>
    );
  }

  if (error || !caseData) {
    return (
      <Box>
        <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Admin - View Case
            </Typography>
            <Button color="inherit" onClick={() => navigate("/admin/cases")}>
              Back to Cases
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Box p={3}>
          <Alert severity="error">{error}</Alert>
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
            Admin - View Case
          </Typography>
          <Button color="inherit" onClick={() => navigate("/admin/cases")}>
            Back to Cases
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
        {/* Case Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h4" gutterBottom>
                {caseData.caseTitle}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                <Chip
                  label={caseData.status}
                  color={getStatusColor(caseData.status) as any}
                />
                <Chip
                  label={`${caseData.priority || "Medium"} Priority`}
                  color={getPriorityColor(caseData.priority || "Medium") as any}
                  variant="outlined"
                />
                <Chip label={caseData.caseType} variant="outlined" />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setEditDialogOpen(true)}
                  fullWidth
                >
                  Quick Edit
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/admin/manage-case/${caseData.id}`)}
                  fullWidth
                >
                  Full Edit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {/* Left Column - Case Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Basic Information */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Case Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Case Title"
                      secondary={caseData.caseTitle}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Category"
                      secondary={caseData.caseType}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <CalendarIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date Filed"
                      secondary={caseData.dateFiled.toDate().toLocaleDateString()}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <FlagIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Priority"
                      secondary={
                        <Chip
                          label={caseData.priority || "Medium"}
                          color={
                            getPriorityColor(
                              caseData.priority || "Medium"
                            ) as any
                          }
                          size="small"
                        />
                      }
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Assigned To"
                      secondary={caseData.assignedTo || "Unassigned"}
                    />
                  </ListItem>
                </List>

                {caseData.description && (
                  <Box mt={3}>
                    <Typography variant="subtitle1" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {caseData.description}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Case Files */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Attached Files
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {caseFiles.length > 0 ? (
                  <List>
                    {caseFiles.map((file) => (
                      <ListItem key={file.id}>
                        <ListItemIcon>
                          <AttachFileIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.fileName}
                          secondary={`Uploaded: ${
                            file.uploadedAt?.toDate?.()?.toLocaleDateString() ||
                            "Unknown"
                          }`}
                        />
                        <IconButton
                          onClick={() => window.open(file.url, "_blank")}
                          size="small"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No files attached to this case
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Actions & History */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Quick Actions */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() =>
                      navigate(`/admin/manage-case/${caseData.id}`)
                    }
                    fullWidth
                  >
                    Edit Case
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CommentIcon />}
                    fullWidth
                    disabled
                  >
                    Add Comment
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AttachFileIcon />}
                    fullWidth
                    disabled
                  >
                    Upload File
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<HistoryIcon />}
                    fullWidth
                    disabled
                  >
                    View History
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Case Timeline */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Case Timeline
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List dense>
                  {caseData.lastUpdated && (
                    <ListItem>
                      <ListItemText
                        primary="Last Updated"
                        secondary={
                          caseData.lastUpdated
                            ?.toDate?.()
                            ?.toLocaleDateString() || "Unknown"
                        }
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Quick Edit Case</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3} pt={1}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newStatus}
                  label="Status"
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newPriority}
                  label="Priority"
                  onChange={(e) => setNewPriority(e.target.value)}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Assigned To"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                placeholder="Enter assignee name or email"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCase} variant="contained">
              Update Case
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ViewCase;
