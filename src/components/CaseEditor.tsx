import React, { useState } from "react";

type CaseEditorProps = {
  caseData: {
    title: string;
    category: string;
    date: string;
    description?: string;
  };
  onSubmit: (updatedData: any) => void;
};

const CaseEditor: React.FC<CaseEditorProps> = ({ caseData, onSubmit }) => {
  const [title, setTitle] = useState(caseData.title);
  const [category, setCategory] = useState(caseData.category);
  const [date, setDate] = useState(caseData.date);
  const [description, setDescription] = useState(caseData.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, category, date, description });
  };

  return (
    <div className="flex gap-6">
      {/* Editable form */}
      <form onSubmit={handleSubmit} className="flex-1 bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Edit Case</h2>
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Category</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Date</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>

      {/* Right: PDF preview */}
      <div className="w-1/2 bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Documents</h3>
        <div className="border h-[500px] bg-gray-100 flex items-center justify-center text-gray-500">
          PDF Preview Placeholder
        </div>
      </div>
    </div>
  );
};

export default CaseEditor;