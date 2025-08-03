import React, { useState, useContext } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useAuth } from "../../auth/AuthContext";

const CreateCaseForm: React.FC = () => {
  const { user, loading } = useAuth();

  const [caseTitle, setCaseTitle] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [caseType, setCaseType] = useState("");
  const [dateFiled, setDateFiled] = useState("");
  const [plaintiff, setPlaintiff] = useState("");
  const [defendant, setDefendant] = useState("");
  const [status, setStatus] = useState("Ongoing");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to file a case.");
      return;
    }

    const newCase = {
      caseTitle,
      caseNumber,
      caseType,
      dateFiled: new Date(dateFiled),
      filedBy: user.uid,
      authorizedUsers: [user.uid],
      participants: {
        plaintiff,
        defendant,
      },
      status,
      fileIds: [],
      lastUpdated: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "cases"), newCase);
      alert("Case successfully created.");
      // Optionally reset the form:
      setCaseTitle("");
      setCaseNumber("");
      setCaseType("");
      setDateFiled("");
      setPlaintiff("");
      setDefendant("");
      setStatus("Ongoing");
    } catch (err) {
      console.error("Error creating case:", err);
      alert("An error occurred while creating the case.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded shadow p-6 w-full max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4">Create New Case</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Case Title</label>
        <input
          type="text"
          value={caseTitle}
          onChange={(e) => setCaseTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="e.g. People vs. Reyes"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Case Number</label>
        <input
          type="text"
          value={caseNumber}
          onChange={(e) => setCaseNumber(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="e.g. RTC121-2025-00123"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Case Type</label>
        <input
          type="text"
          value={caseType}
          onChange={(e) => setCaseType(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="e.g. Criminal"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Date Filed</label>
        <input
          type="date"
          value={dateFiled}
          onChange={(e) => setDateFiled(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Plaintiff</label>
        <input
          type="text"
          value={plaintiff}
          onChange={(e) => setPlaintiff(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="e.g. Juan Dela Cruz"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Defendant</label>
        <input
          type="text"
          value={defendant}
          onChange={(e) => setDefendant(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="e.g. Jane Doe"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-1">Case Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        >
          <option value="Ongoing">Ongoing</option>
          <option value="Resolved">Resolved</option>
          <option value="Dismissed">Dismissed</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Submit Case
      </button>
    </form>
  );
};

export default CreateCaseForm;