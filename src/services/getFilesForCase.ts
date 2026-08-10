import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function getFilesForCase(caseId: string) {
  const q = query(collection(db, "caseFiles"), where("caseId", "==", caseId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as {
      fileName: string;
      fileType: string;
      downloadUrl: string;
      uploadedAt: any;
      uploadedBy: string;
    }),
  }));
}