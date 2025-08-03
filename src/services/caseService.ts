import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { COLLECTIONS } from "../types/firestore";
import { Case } from "../types/Case";

export async function createCase(newCase: Omit<Case, "filedBy" | "dateFiled" | "lastUpdated">, userId: string) {
  const caseWithMeta: Case = {
    ...newCase,
    filedBy: userId,
    dateFiled: Timestamp.now(),
    lastUpdated: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.CASES), caseWithMeta);
  return docRef.id;
}