import React from "react";
import { useParams } from "react-router-dom";
import HeaderAdmin from "../../components/HeaderAdmin";
import UserCard from "../../components/UserCard";
import CaseCard from "../../components/CaseCard";

// Dummy data for illustration
const dummyUser = {
  fullName: "Atty. Juan Dela Cruz",
  email: "juan@example.com",
  role: "Lawyer",
};

const dummyCases = [
  {
    id: "c1",
    title: "Criminal Case 001",
    dateFiled: "2024-11-12",
    status: "Open",
  },
  {
    id: "c2",
    title: "Civil Case 042",
    dateFiled: "2025-01-05",
    status: "Closed",
  },
];

const ViewUser: React.FC = () => {
  const { id } = useParams(); // User ID from route param
  // You could fetch actual user/case data here using useEffect + service

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderAdmin />

      <main className="px-8 py-6 max-w-5xl mx-auto space-y-8">
        <h2 className="text-2xl font-semibold">User Information</h2>

        <UserCard
          fullName={dummyUser.fullName}
          email={dummyUser.email}
          role={dummyUser.role}
        />

        <section className="pt-4">
          <h3 className="text-xl font-semibold mb-4">User Cases:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dummyCases.map((c) => (
              <CaseCard
                key={c.id}
                title={c.title}
                dateFiled={c.dateFiled}
                status={c.status}
                onView={() => console.log("Viewing case", c.id)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ViewUser;