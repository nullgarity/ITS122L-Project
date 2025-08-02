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

const CreateCase = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
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
      // Step 1: Add case
      const docRef = await addDoc(collection(db, "cases"), {
        title,
        dateFiled: date,
        category,
        description,
        status: "Pending",
        createdBy: user?.uid,
        createdAt: serverTimestamp(),
      });

      const caseId = docRef.id;

      // Step 2: Upload files
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

      setTitle("");
      setDate("");
      setCategory("");
      setDescription("");
      setFiles(null);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit case. Please try again.");
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
            Create New Case
          </Typography>
          <Button color="inherit" onClick={() => navigate("/user/dashboard")}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate("/user/my-cases")}>
            My Cases
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Create New Case
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3}>
          Fill out the form below to submit a new case. All fields marked with *
          are required.
        </Typography>

        <Paper sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Case Title *"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title for your case"
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
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Case Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide additional details about the case (optional)"
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
                    accept="application/pdf"
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
                    onClick={() => navigate("/user/dashboard")}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={uploading || !title || !date || !category}
                  >
                    {uploading ? "Submitting..." : "Submit Case"}
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
            Case submitted successfully! You can view it in "My Cases".
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
