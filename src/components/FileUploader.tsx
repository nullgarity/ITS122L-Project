import React, { useRef, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, storage } from "../services/firebase";
import { Box, Button, LinearProgress, Typography } from "@mui/material";

interface FileUploadProps {
  caseId: string;
  userId: string;
  onUploadSuccess?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ caseId, userId, onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `caseFiles/${caseId}/${file.name}`);
    setUploading(true);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, "caseFiles"), {
        caseId,
        fileName: file.name,
        fileType: "Annex", // TODO: make dynamic later
        downloadUrl,
        uploadedBy: userId,
        uploadedAt: Timestamp.now(),
      });

      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Button variant="outlined" onClick={() => fileInputRef.current?.click()} fullWidth>
        Upload File
      </Button>
      <input type="file" ref={fileInputRef} hidden onChange={handleUpload} />
      {uploading && (
        <Box mt={1}>
          <Typography variant="body2">Uploading...</Typography>
          <LinearProgress />
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;