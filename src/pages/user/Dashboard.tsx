import React from "react";
import HeaderUser from "../../components/HeaderUser";

const UserDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderUser />

      <main className="px-8 py-6">
        <h2 className="text-xl font-semibold mb-4">Your Most Recent Case</h2>

        <div className="grid grid-cols-3 gap-6">
          {/* Left: Case Info */}
          <div className="col-span-1 bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-2">Lorem ipsum dolor sit amet</h3>
            <p className="text-gray-600 mb-1">Date: 06/27/2025</p>
            <p className="text-gray-600 mb-1">
              Category: Contractual, Apology Act
            </p>
            <div className="mt-4 space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                View
              </button>
              <button className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
                Edit
              </button>
            </div>
          </div>

          {/* Right: PDF Preview Placeholder */}
          <div className="col-span-2 bg-white p-6 rounded shadow flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="mb-2">PDF Preview</p>
              <div className="w-full h-72 border rounded bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">PDF Content Here</span>
              </div>
              <p className="mt-2">Page 1 of 3</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;