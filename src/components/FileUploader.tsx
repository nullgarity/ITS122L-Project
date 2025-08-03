// src/components/FileUploader.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  List,
  ListItem,
  Link,
  Alert,
} from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

interface FileUploaderProps {
  caseId: string;
  onUploadSuccess?: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ caseId, onUploadSuccess }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; fileName: string }[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const fetchUploadedFiles = async () => {
    const db = getFirestore();
    const q = query(collection(db, "caseFiles"), where("caseId", "==", caseId));
    const querySnapshot = await getDocs(q);
    const results: { url: string; fileName: string }[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({ url: data.url, fileName: data.fileName });
    });
    setUploadedFiles(results);
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, [caseId]);

  const handleUpload = async () => {
    if (!files || files.length === 0) return;

    const storage = getStorage();
    const db = getFirestore();
    setUploading(true);
    setError("");
    setSuccessMessage("");

    try {
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

      setSuccessMessage("Files uploaded successfully.");
      setFiles(null);
      onUploadSuccess?.();
      fetchUploadedFiles();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box mt={2}>
      <input type="file" multiple onChange={handleChange} />
      <Box mt={1}>
        <Button variant="contained" onClick={handleUpload} disabled={uploading || !files}>
          {uploading ? "Uploading..." : "Upload PDF"}
        </Button>
      </Box>

      {uploading && <LinearProgress sx={{ mt: 1 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

      {uploadedFiles.length > 0 && (
        <Box mt={3}>
          <Typography variant="subtitle1">Uploaded Files:</Typography>
          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem key={index}>
                <Link href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.fileName}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default FileUploader;
