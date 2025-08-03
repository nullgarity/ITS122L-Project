// src/pages/user/ManageCase.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Paper,
  Divider,
  Stack,
  List,
  ListItem,
  Link,
} from "@mui/material";
import { db } from "../../services/firebase";
import { useAuth } from "../../auth/AuthContext";
import FileUploader from "../../components/FileUploader";

interface FileRecord {
  fileName: string;
  url: string;
}

const ManageCase: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [dateFiled, setDateFiled] = useState("");
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const loadCase = async () => {
      try {
        const docRef = doc(db, "cases", id!);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setCategory(data.category);
          setDateFiled(data.dateFiled);
        }

        const q = query(collection(db, "caseFiles"), where("caseId", "==", id));
        const fileSnap = await getDocs(q);
        const fetchedFiles: FileRecord[] = [];
        fileSnap.forEach((doc) => {
          const data = doc.data();
          fetchedFiles.push({ fileName: data.fileName, url: data.url });
        });
        setFiles(fetchedFiles);
      } catch (error) {
        console.error("Error loading case:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "cases", id!);
      await updateDoc(docRef, {
        title,
        category,
        dateFiled,
        updatedAt: serverTimestamp(),
      });
      alert("Case updated.");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this case?")) return;
    try {
      const docRef = doc(db, "cases", id!);
      await deleteDoc(docRef);
      alert("Case deleted.");
      navigate("/user/my-cases");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
        <Typography ml={2}>Loading case...</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" mt={5}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Manage Case
        </Typography>
        <Button variant="text" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          ← Back to My Cases
        </Button>

        {isAdmin ? (
          <Box component="form" onSubmit={handleUpdate}>
            <TextField
              label="Case Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date Filed"
              type="date"
              value={dateFiled}
              onChange={(e) => setDateFiled(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <Stack direction="row" spacing={2} mt={3}>
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </Stack>
          </Box>
        ) : (
          <Typography color="text.secondary" mt={2}>
            You do not have permission to edit this case.
          </Typography>
        )}

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" mb={1}>
          Uploaded PDF Files
        </Typography>
        {files.length === 0 ? (
          <Typography color="text.secondary">No files uploaded for this case.</Typography>
        ) : (
          <List>
            {files.map((file, index) => (
              <ListItem key={index}>
                <Link href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.fileName}
                </Link>
              </ListItem>
            ))}
          </List>
        )}

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" mb={1}>
          Upload More Files
        </Typography>
        {id && (
          <FileUploader
            caseId={id}
            onUploadSuccess={() => {
              alert("Upload successful!");
              window.location.reload();
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default ManageCase;
