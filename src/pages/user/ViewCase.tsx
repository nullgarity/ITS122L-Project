// src/pages/user/ViewCase.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

interface CaseData {
  title: string;
  category: string;
  date: string;
  status?: string;
  createdAt?: any;
  updatedAt?: any;
}

const ViewCase: React.FC = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const docRef = doc(db, "cases", id!);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCaseData(docSnap.data() as CaseData);
        } else {
          console.warn("No such case!");
        }
      } catch (error) {
        console.error("Error fetching case:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  if (loading) return <p className="p-6">Loading case...</p>;
  if (!caseData) return <p className="p-6">Case not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Case Details</h1>

      <p className="mb-2">
        <strong>Title:</strong> {caseData.title}
      </p>

      <p className="mb-2">
        <strong>Category:</strong> {caseData.category}
      </p>

      <p className="mb-2">
        <strong>Date:</strong> {caseData.date}
      </p>

      <p className="mb-2">
        <strong>Status:</strong> {caseData.status ?? "open"}
      </p>

      <p className="text-sm text-gray-500 mt-4">
        Created:{" "}
        {caseData.createdAt?.toDate
          ? caseData.createdAt.toDate().toLocaleString()
          : "N/A"}
      </p>

      <p className="text-sm text-gray-500">
        Last Updated:{" "}
        {caseData.updatedAt?.toDate
          ? caseData.updatedAt.toDate().toLocaleString()
          : "N/A"}
      </p>
    </div>
  );
};

export default ViewCase;
