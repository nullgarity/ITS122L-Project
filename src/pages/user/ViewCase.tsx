// src/pages/user/ViewCase.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Box, Typography, Paper, List, ListItem, Link } from "@mui/material";

interface CaseData {
  title: string;
  category: string;
  dateFiled: string;
  status?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface FileRecord {
  fileName: string;
  url: string;
}

const ViewCase: React.FC = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<FileRecord[]>([]);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const docRef = doc(db, "cases", id!);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCaseData(docSnap.data() as CaseData);
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
        console.error("Error fetching case:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  if (loading) return <Box p={4}>Loading case...</Box>;
  if (!caseData) return <Box p={4}>Case not found.</Box>;

  return (
    <Box p={4} maxWidth="800px" margin="auto">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>Case Details</Typography>

        <Typography><strong>Title:</strong> {caseData.title}</Typography>
        <Typography><strong>Category:</strong> {caseData.category}</Typography>
        <Typography><strong>Date Filed:</strong> {caseData.dateFiled}</Typography>
        <Typography><strong>Status:</strong> {caseData.status ?? "Open"}</Typography>
        <Typography sx={{ mt: 2 }} fontSize={14} color="text.secondary">
          Created: {caseData.createdAt?.toDate?.() ? caseData.createdAt.toDate().toLocaleString() : "N/A"}
        </Typography>
        <Typography fontSize={14} color="text.secondary">
          Last Updated: {caseData.updatedAt?.toDate?.() ? caseData.updatedAt.toDate().toLocaleString() : "N/A"}
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
