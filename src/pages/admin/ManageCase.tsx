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
import { Case } from "../../types/Case";

interface FileRecord {
  fileName: string;
  url: string;
}

const ManageCase: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserRole(data.role || null);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    const loadCase = async () => {
      try {
        const docRef = doc(db, "cases", id!);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCaseData(docSnap.data() as Case);
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
    if (!caseData) return;
    try {
      const docRef = doc(db, "cases", id!);
      await updateDoc(docRef, {
        ...caseData,
        lastUpdated: serverTimestamp(),
      });
      alert("Case updated.");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this case?")) return;
    try {
      await deleteDoc(doc(db, "cases", id!));
      alert("Case deleted.");
      navigate("/admin/manage-cases");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading || userRole === null) {
    return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  }

  if (!caseData) {
    return <Typography mt={4} textAlign="center">Case not found.</Typography>;
  }

  if (userRole !== "admin") {
    return <Typography mt={4} textAlign="center">Unauthorized Access</Typography>;
  }

  return (
    <Box maxWidth="md" mx="auto" mt={5}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Admin Manage Case
        </Typography>
        <Button variant="text" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          ← Back to Manage Cases
        </Button>

        <Box component="form" onSubmit={handleUpdate}>
          <TextField
            label="Case Number"
            value={caseData.caseNumber}
            onChange={(e) => setCaseData({ ...caseData, caseNumber: e.target.value })}
            fullWidth margin="normal"
          />
          <TextField
            label="Title"
            value={caseData.caseTitle}
            onChange={(e) => setCaseData({ ...caseData, caseTitle: e.target.value })}
            fullWidth margin="normal"
          />
          <TextField
            label="Type"
            value={caseData.caseType}
            onChange={(e) => setCaseData({ ...caseData, caseType: e.target.value })}
            fullWidth margin="normal"
          />
          <TextField
            label="Plaintiff"
            value={caseData.participants.plaintiff}
            onChange={(e) =>
              setCaseData({
                ...caseData,
                participants: { ...caseData.participants, plaintiff: e.target.value },
              })
            }
            fullWidth margin="normal"
          />
          <TextField
            label="Defendant"
            value={caseData.participants.defendant}
            onChange={(e) =>
              setCaseData({
                ...caseData,
                participants: { ...caseData.participants, defendant: e.target.value },
              })
            }
            fullWidth margin="normal"
          />
          <TextField
            label="Status"
            value={caseData.status}
            onChange={(e) => setCaseData({ ...caseData, status: e.target.value })}
            fullWidth margin="normal"
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

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6">Uploaded Files</Typography>
        {files.length === 0 ? (
          <Typography color="text.secondary">No files uploaded.</Typography>
        ) : (
          <List>
            {files.map((file, idx) => (
              <ListItem key={idx}>
                <Link href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.fileName}
                </Link>
              </ListItem>
            ))}
          </List>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6">Upload More Files</Typography>
        <FileUploader caseId={id!} onUploadSuccess={() => window.location.reload()} />
      </Paper>
    </Box>
  );
};

export default ManageCase;