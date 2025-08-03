import { Timestamp } from "firebase/firestore";

export const COLLECTIONS = {
  USERS: "users",
  CASES: "cases",
  FILES: "caseFiles",
};

export interface Case {
  uid: string;
  title: string;
  category: string;
  date: string; // or you can change this to Date or Timestamp later
  createdBy: string; // user UID
  createdAt: Timestamp;
}