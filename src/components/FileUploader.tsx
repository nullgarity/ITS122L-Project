import React, { useState } from "react";
import { Box, Button, Typography, LinearProgress } from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

interface FileUploaderProps {
  caseId: string;
  onUploadSuccess?: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ caseId, onUploadSuccess }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) return;

    const storage = getStorage();
    const db = getFirestore();

    setUploading(true);
    setError("");

    try {
      for (const file of Array.from(files)) {
        const storageRef = ref(storage, `cases/${caseId}/${uuidv4()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        await addDoc(collection(db, "caseFiles"), {
          caseId,
          fileName: file.name,
          url: downloadURL,
          uploadedAt: serverTimestamp()
        });
      }

      setFiles(null);
      onUploadSuccess?.();
    } catch (err) {
      console.error(err);
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box mt={2}>
      <input type="file" multiple onChange={handleChange} />
      <Box mt={1}>
        <Button variant="contained" onClick={handleUpload} disabled={uploading || !files}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </Box>
      {uploading && <LinearProgress sx={{ mt: 1 }} />}
      {error && <Typography color="error" mt={1}>{error}</Typography>}
    </Box>
  );
};

export default FileUploader;
