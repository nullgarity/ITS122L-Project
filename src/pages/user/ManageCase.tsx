// src/pages/user/ManageCase.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

const ManageCase: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCase = async () => {
      try {
        const docRef = doc(db, "cases", id!);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setCategory(data.category);
          setDate(data.date);
        }
      } catch (error) {
        console.error("Error loading case:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "cases", id!);
      await updateDoc(docRef, {
        title,
        category,
        date,
        updatedAt: new Date(),
      });
      alert("Case updated.");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this case?")) return;
    try {
      const docRef = doc(db, "cases", id!);
      await deleteDoc(docRef);
      alert("Case deleted.");
      navigate("/my-cases");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <form
      onSubmit={handleUpdate}
      className="bg-white p-6 max-w-2xl mx-auto rounded shadow"
    >
      <h2 className="text-2xl font-semibold mb-4">Manage Case</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </form>
  );
};

export default ManageCase;
