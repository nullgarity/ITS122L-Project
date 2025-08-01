// src/pages/user/CreateCase.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import CreateCaseForm from "../../components/CreateCaseForm";
import { createCase } from "../../services/caseService";
import { getAuth } from "firebase/auth";

const CreateCase: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSubmit = async (data: { title: string; category: string; date: string }) => {
    if (!user) {
      alert("You must be logged in to create a case.");
      return;
    }

    try {
      await createCase({
        ...data,
        userId: user.uid, // Attach current user ID
      });

      alert("Case successfully created!");
      navigate("/user/my-cases"); // Redirect to user's cases
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
