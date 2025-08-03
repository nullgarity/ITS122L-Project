import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { Case } from "../types/Case";

export interface CaseItem {
  id: string;
  title: string;
  category: string;
  dateFiled: string;
  status: string;
  lastUpdated: string;
}

export const getAuthorizedCases = async (uid: string): Promise<CaseItem[]> => {
  const q = query(collection(db, "cases"), where("authorizedUsers", "array-contains", uid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.caseTitle || "Untitled",
      category: data.caseType || "General",
      dateFiled: data.dateFiled || "",
      status: data.status || "Unknown",
      lastUpdated: data.lastUpdated || "",
    };
  });
};