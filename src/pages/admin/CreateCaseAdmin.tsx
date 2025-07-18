import React from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import CreateCase from "../../components/CreateCase";

const CreateCaseAdmin: React.FC = () => {
  const handleSubmit = (data: any) => {
    console.log("Admin creating case:", data);
    // Call caseService.createCase(data) here
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderAdmin />
      <main className="p-6">
        <CreateCase onSubmit={handleSubmit} />
      </main>
    </div>
  );
};

export default CreateCaseAdmin;