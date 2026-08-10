import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Box, Typography, Paper, List, ListItem, Link } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";

interface CaseData {
  caseNumber: string;
  caseTitle: string;
  caseType: string;
  dateFiled: Timestamp;
  lastUpdated: Timestamp;
  filedBy: string;
  authorizedUsers: string[];
  fileIds: string[];
  participants: {
    plaintiff: string;
    defendant: string;
  };
  status: "Ongoing" | "Closed" | "Archived" | string;
}

interface FileRecord {
  fileName: string;
  url: string;
}

const ViewCase: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // get current user
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !id) return;

      try {
        // 1. Check if user is authorized for this case
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setUnauthorized(true);
          return;
        }

        const userData = userSnap.data();
        const authorizedCases: string[] = userData.authorizedCases || [];

        if (!authorizedCases.includes(id)) {
          setUnauthorized(true);
          return;
        }

        // 2. Fetch case details
        const caseRef = doc(db, "cases", id);
        const caseSnap = await getDoc(caseRef);

        if (!caseSnap.exists()) {
          setCaseData(null);
        } else {
          setCaseData(caseSnap.data() as CaseData);
        }

        // 3. Fetch case files
        const fileQuery = query(collection(db, "caseFiles"), where("caseId", "==", id));
        const fileSnap = await getDocs(fileQuery);
        const fetchedFiles: FileRecord[] = [];
        fileSnap.forEach((doc) => {
          const data = doc.data();
          fetchedFiles.push({ fileName: data.fileName, url: data.url });
        });
        setFiles(fetchedFiles);
      } catch (error) {
        console.error("Error loading case:", error);
        setUnauthorized(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  if (loading) return <Box p={4}>Loading case...</Box>;
  if (unauthorized) return <Box p={4}><Typography color="error">Unauthorized: You do not have access to this case.</Typography></Box>;
  if (!caseData) return <Box p={4}>Case not found.</Box>;

  return (
    <Box p={4} maxWidth="800px" margin="auto">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>Case Details</Typography>

        <Typography><strong>Title:</strong> {caseData.caseTitle}</Typography>
        <Typography><strong>Category:</strong> {caseData.caseType}</Typography>
        <Typography>
          <strong>Date Filed:</strong> {caseData.dateFiled.toDate().toLocaleString()}
        </Typography>
        <Typography><strong>Status:</strong> {caseData.status ?? "Open"}</Typography>
        <Typography fontSize={14} color="text.secondary">
          Last Updated: {caseData.lastUpdated?.toDate?.() ? caseData.lastUpdated.toDate().toLocaleString() : "N/A"}
        </Typography>

        {/* Uploaded Files */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Uploaded Files</Typography>
          {files.length === 0 ? (
            <Typography>No files uploaded for this case.</Typography>
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
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewCase;