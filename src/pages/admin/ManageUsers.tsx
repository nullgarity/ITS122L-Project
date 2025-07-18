import React from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import UserCard from "../../components/UserCard";
import { useNavigate } from "react-router-dom";

const dummyUsers = [
  {
    id: "u1",
    fullName: "Atty. Juan Dela Cruz",
    email: "juan@example.com",
    role: "Lawyer",
  },
  {
    id: "u2",
    fullName: "Admin Maria Santos",
    email: "maria@example.com",
    role: "Administrator",
  },
  {
    id: "u3",
    fullName: "Paralegal Ana Reyes",
    email: "ana@example.com",
    role: "Paralegal",
  },
];

const ManageUsers: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderAdmin />

      <main className="px-8 py-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Manage Users</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyUsers.map((user) => (
            <UserCard
              key={user.id}
              fullName={user.fullName}
              email={user.email}
              role={user.role}
              onManage={() => navigate(`/admin/manage-user/${user.id}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ManageUsers;