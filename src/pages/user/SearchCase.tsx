import React, { useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { Link } from "react-router-dom";

interface CaseItem {
  id: string;
  title: string;
  category: string;
  date: string;
  status?: string;
}

const SearchCase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);

    try {
      const casesRef = collection(db, "cases");

      const q = query(
        casesRef,
        orderBy("title"),
        startAt(searchTerm),
        endAt(searchTerm + "\uf8ff")
      );

      const snapshot = await getDocs(q);
      const matches: CaseItem[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        matches.push({
          id: doc.id,
          title: data.title,
          category: data.category,
          date: data.date,
          status: data.status || "open",
        });
      });

      setResults(matches);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search Cases</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          placeholder="Enter case title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p>Searching...</p>
      ) : results.length === 0 ? (
        <p>No matching cases found.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((item) => (
            <li
              key={item.id}
              className="p-4 border rounded shadow-sm bg-white hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-600">
                {item.category} • {item.date}
              </p>
              <p className="text-sm text-blue-600 mt-1 capitalize">
                Status: {item.status}
              </p>

              <div className="mt-2 flex gap-4">
                <Link
                  to={`/user/view-case/${item.id}`}
                  className="text-sm text-blue-500 underline"
                >
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchCase;
