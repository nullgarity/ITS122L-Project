import { Timestamp } from "firebase/firestore";

export interface Case {
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