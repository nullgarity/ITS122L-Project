import { Timestamp } from "firebase/firestore";

export interface Case {
  caseNumber: string;
  caseTitle: string;
  caseType: string;
  dateFiled: Timestamp;
  lastUpdated: Timestamp;
  filedBy: string; // user ID of the one who filed
  authorizedUsers: string[]; // split from CSV string in DB
  fileIds: string[];         // split from CSV string in DB
  participants: {
    plaintiff: string;
    defendant: string;
  };
  status: "Ongoing" | "Closed" | "Archived" | string; // you can narrow types later
}