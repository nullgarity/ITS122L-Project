import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  MenuItem,
  LinearProgress,
} from "@mui/material";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const CreateCase = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title || !date || !category) return;

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
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      const caseId = docRef.id;

      // Step 2: Upload files
      if (files) {
        for (const file of Array.from(files)) {
          const storageRef = ref(storage, `cases/${caseId}/${uuidv4()}_${file.name}`);
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
      setFiles(null);
      alert("Case submitted successfully!");

    } catch (err) {
      console.error(err);
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="center" gap={4} bgcolor="#9e9e9e" py={1}>
        <Button variant="text">My Cases</Button>
        <Button variant="text">Categories</Button>
        <Button variant="contained">Create New</Button>
      </Box>

      <Box p={4} bgcolor="#bdbdbd">
        <Typography variant="h6" mb={2}>Create New Case</Typography>
        <Paper elevation={2} sx={{ p: 3, maxWidth: 600 }}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Category"
            select
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            margin="normal"
          >
            <MenuItem value="Criminal">Criminal</MenuItem>
            <MenuItem value="Civil">Civil</MenuItem>
            <MenuItem value="Family">Family</MenuItem>
          </TextField>

          {/* Upload PDF */}
          <Box mt={2}>
            <Button variant="contained" component="label">
              Upload PDF
              <input type="file" hidden multiple accept="application/pdf" onChange={(e) => setFiles(e.target.files)} />
            </Button>
            {files && (
              <Typography mt={1}>
                {Array.from(files).map((f) => f.name).join(", ")}
              </Typography>
            )}
          </Box>

          {/* Submit */}
          <Box mt={3}>
            <Button variant="contained" color="success" onClick={handleSubmit} disabled={uploading}>
              {uploading ? "Submitting..." : "Submit"}
            </Button>
            {uploading && <LinearProgress sx={{ mt: 2 }} />}
            {error && <Typography color="error" mt={1}>{error}</Typography>}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CreateCase;
