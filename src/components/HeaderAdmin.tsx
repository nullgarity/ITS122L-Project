import React from "react";

const HeaderAdmin: React.FC = () => {
  return (
    <header className="bg-white shadow">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-3 border-b">
        {/* Search */}
        <input
          type="text"
          placeholder="Search Cases or Users"
          className="w-1/3 px-4 py-2 border rounded"
        />

        {/* Admin Name + Logout */}
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-700">Administrator</span>
          <button className="text-red-500 hover:underline">Log Out</button>
        </div>
      </div>

      {/* Bottom Bar Nav */}
      <nav className="flex space-x-6 px-6 py-2 bg-gray-100 text-blue-600 font-medium">
        <button className="hover:underline">Manage Users</button>
        <button className="hover:underline">Manage Cases</button>
        <button className="hover:underline">Create New</button>
      </nav>
    </header>
  );
};

export default HeaderAdmin;