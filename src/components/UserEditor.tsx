import React, { useState } from "react";

type UserEditorProps = {
  userData: {
    name: string;
    email: string;
    role: string;
  };
  onSubmit: (updatedData: any) => void;
};

const UserEditor: React.FC<UserEditorProps> = ({ userData, onSubmit }) => {
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [role, setRole] = useState(userData.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, role });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Edit User</h2>
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block mb-1">Role</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Save Changes
      </button>
    </form>
  );
};

export default UserEditor;