// src/pages/admin/CreateCase.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import CreateCaseForm from "../../components/CreateCase";
// import { createCase } from "../../services/caseService"; // TODO: Implement createCase service
import { getAuth } from "firebase/auth";

const CreateCase: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSubmit = async (data: {
    title: string;
    category: string;
    date: string;
  }) => {
    if (!user) {
      alert("You must be logged in to create a case.");
      return;
    }

    try {
      // TODO: Implement createCase service function
      // await createCase({
      //   ...data,
      //   userId: user.uid, // Attach current user ID
      // });

      console.log("Case data:", { ...data, userId: user.uid });
      alert(
        "Case creation functionality not yet implemented - but form works!"
      );
      navigate("/admin/dashboard"); // Redirect to admin dashboard
    } catch (error) {
      console.error("Error creating case:", error);
      alert("Failed to create case. Try again.");
    }
  };

  return (
    <div className="p-6">
      <CreateCaseForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateCase;
