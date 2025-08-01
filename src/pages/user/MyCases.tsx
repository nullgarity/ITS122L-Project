// src/pages/user/MyCases.tsx
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../services/firebase";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

interface CaseItem {
  id: string;
  title: string;
  category: string;
  date: string;
  status?: string;
}

const MyCases: React.FC = () => {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCases = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "cases"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const caseList: CaseItem[] = [];

        querySnapshot.forEach((doc) => {
          caseList.push({
            id: doc.id,
            ...(doc.data() as Omit<CaseItem, "id">),
          });
        });

        setCases(caseList);
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [user]);

  if (!user) return <p>Please log in to view your cases.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Cases</h1>

      {loading ? (
        <p>Loading cases...</p>
      ) : cases.length === 0 ? (
        <p>No cases found.</p>
      ) : (
        <ul className="space-y-4">
          {cases.map((item) => (
            <li
              key={item.id}
              className="p-4 border rounded shadow-sm bg-white hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-600">
                {item.category} • {item.date}
              </p>
              <p className="text-sm text-blue-600 mt-1 capitalize">
                Status: {item.status || "open"}
              </p>

              <div className="mt-2 flex gap-4">
                <Link
                  to={`/user/view-case/${item.id}`}
                  className="text-sm text-blue-500 underline"
                >
                  View
                </Link>
                <Link
                  to={`/user/manage-case/${item.id}`}
                  className="text-sm text-green-500 underline"
                >
                  Manage
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyCases;
