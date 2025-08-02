import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  MenuItem,
  LinearProgress,
  AppBar,
  Toolbar,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";

const CreateCase: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !category) {
      setError("Please fill in all required fields");
      return;
    }

    const db = getFirestore();
    const storage = getStorage();
    setUploading(true);
    setError("");

    try {
      // Create case with admin-specific fields
      const docRef = await addDoc(collection(db, "cases"), {
        title,
        dateFiled: date,
        category,
        description,
        priority,
        assignedTo,
        status: "Open",
        createdBy: user?.uid,
        createdByAdmin: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const caseId = docRef.id;

      // Upload files if any
      if (files) {
        for (const file of Array.from(files)) {
          const storageRef = ref(
            storage,
            `cases/${caseId}/${uuidv4()}_${file.name}`
          );
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);

          await addDoc(collection(db, "caseFiles"), {
            caseId,
            fileName: file.name,
            url: downloadURL,
            uploadedAt: serverTimestamp(),
          });
        }
      }

      // Reset form
      setTitle("");
      setDate("");
      setCategory("");
      setDescription("");
      setPriority("Medium");
      setAssignedTo("");
      setFiles(null);
      setSuccess(true);
    } catch (err) {
      console.error("Error creating case:", err);
      setError("Failed to create case. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin - Create New Case
          </Typography>
          <Button color="inherit" onClick={() => navigate("/admin/dashboard")}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate("/admin/cases")}>
            Manage Cases
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
        <Typography variant="h4" gutterBottom>
          Create New Case (Admin)
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3}>
          Create a new case with administrative privileges. You can assign
          priorities and manage case details.
        </Typography>

        <Paper sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Case Title *"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title for the case"
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Date Filed *"
                  type="date"
                  fullWidth
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Category *"
                  select
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value="Criminal Law">Criminal Law</MenuItem>
                  <MenuItem value="Civil Law">Civil Law</MenuItem>
                  <MenuItem value="Family Law">Family Law</MenuItem>
                  <MenuItem value="Corporate Law">Corporate Law</MenuItem>
                  <MenuItem value="Constitutional Law">
                    Constitutional Law
                  </MenuItem>
                  <MenuItem value="Labor Law">Labor Law</MenuItem>
                  <MenuItem value="Tax Law">Tax Law</MenuItem>
                  <MenuItem value="Administrative Law">
                    Administrative Law
                  </MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Priority"
                  select
                  fullWidth
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Assigned To"
                  fullWidth
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Enter user email or ID (optional)"
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Case Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed information about the case"
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Supporting Documents
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ p: 2, textAlign: "left", justifyContent: "flex-start" }}
                >
                  {files
                    ? `${files.length} file(s) selected`
                    : "Click to upload PDF files"}
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="application/pdf,.doc,.docx"
                    onChange={(e) => setFiles(e.target.files)}
                  />
                </Button>
                {files && (
                  <Box mt={1}>
                    <Typography variant="body2" color="textSecondary">
                      Selected files:{" "}
                      {Array.from(files)
                        .map((f) => f.name)
                        .join(", ")}
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/admin/dashboard")}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={uploading || !title || !date || !category}
                  >
                    {uploading ? "Creating Case..." : "Create Case"}
                  </Button>
                </Box>
                {uploading && <LinearProgress sx={{ mt: 2 }} />}
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Success/Error Messages */}
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success" onClose={() => setSuccess(false)}>
            Case created successfully! You can view it in "Manage Cases".
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
        >
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default CreateCase;
