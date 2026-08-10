import React, { useState } from "react";

type CreateCaseFormProps = {
  onSubmit: (data: any) => void;
};

const CreateCaseForm: React.FC<CreateCaseFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase = { title, category, date };
    onSubmit(newCase);
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          placeholder="e.g. People vs. Reyes"
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
          placeholder="e.g. Civil Law"
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