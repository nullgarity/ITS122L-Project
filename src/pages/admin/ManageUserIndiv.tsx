import React from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import UserEditor from "../../components/UserEditor";
import UserCasesList from "../../components/UserCasesList";

const ManageUser: React.FC = () => {
  const user = {
    name: "Carlo",
    email: "carlo@example.com",
    role: "user",
  };

  const userCases = [
    {
      id: "1",
      title: "Reyes v. People",
      category: "Criminal",
      date: "2025-06-21",
    },
    {
      id: "2",
      title: "Estate of Mendoza",
      category: "Civil",
      date: "2025-07-01",
    },
  ];

  const handleUpdate = (updatedData: any) => {
    console.log("Updated user data:", updatedData);
    // call userService.updateUser()
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderAdmin />
      <main className="p-6 max-w-5xl mx-auto">
        <UserEditor userData={user} onSubmit={handleUpdate} />
        <UserCasesList cases={userCases} />
      </main>
    </div>
  );
};

export default ManageUser;