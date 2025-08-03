import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  Box, Button, Typography, CircularProgress, Paper, Divider,
  List, ListItem, Link,
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const loadCase = async () => {
      if (!user) return;

      try {
        // Step 1: Fetch Firestore user
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.error("User profile not found in Firestore.");
          setAuthorized(false);
          return;
        }

        const userData = userDocSnap.data();
        const authorizedCases: string[] = userData.authorizedCases
          ? userData.authorizedCases.split(",").map((c: string) => c.trim())
          : [];

        if (!authorizedCases.includes(id!)) {
          setAuthorized(false);
          return;
        }

        // Step 2: Fetch case data
        const caseDoc = await getDoc(doc(db, "cases", id!));
        if (!caseDoc.exists()) {
          setAuthorized(false);
          return;
        }
        setCaseData(caseDoc.data() as Case);
        setAuthorized(true);

        // Step 3: Fetch case files
        const fileQuery = query(collection(db, "caseFiles"), where("caseId", "==", id));
        const fileSnap = await getDocs(fileQuery);
        const fileList: FileRecord[] = [];
        fileSnap.forEach((doc) => {
          const data = doc.data();
          fileList.push({ fileName: data.fileName, url: data.url });
        });
        setFiles(fileList);
      } catch (error) {
        console.error("Error loading case data:", error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [id, user]);

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  }

  if (authorized === false) {
    return <Typography mt={4} textAlign="center">403 - You are not authorized to view this case.</Typography>;
  }

  if (!caseData) {
    return <Typography mt={4} textAlign="center">Case not found.</Typography>;
  }

  return (
    <Box maxWidth="md" mx="auto" mt={5}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Manage Case
        </Typography>
        <Button variant="text" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          ← Back
        </Button>

        <Typography><strong>Case Number:</strong> {caseData.caseNumber}</Typography>
        <Typography><strong>Title:</strong> {caseData.caseTitle}</Typography>
        <Typography><strong>Type:</strong> {caseData.caseType}</Typography>
        <Typography><strong>Date Filed:</strong> {caseData.dateFiled.toDate().toDateString()}</Typography>
        <Typography><strong>Status:</strong> {caseData.status}</Typography>
        <Typography><strong>Plaintiff:</strong> {caseData.participants.plaintiff}</Typography>
        <Typography><strong>Defendant:</strong> {caseData.participants.defendant}</Typography>

        <Divider sx={{ my: 3 }} />

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