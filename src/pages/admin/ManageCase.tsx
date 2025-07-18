import React from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import CaseCard from "../../components/CaseCard";

const dummyCases = [
  {
    title: "People vs. Dela Cruz",
    date: "07/10/2025",
    category: "Criminal Law",
  },
  {
    title: "Republic vs. Reyes",
    date: "06/18/2025",
    category: "Civil Law",
  },
];

const ManageCases: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderAdmin />

      <main className="px-8 py-6">
        <h2 className="text-xl font-semibold mb-4">All Cases</h2>

        <div className="grid grid-cols-2 gap-6">
          {dummyCases.map((c, i) => (
            <CaseCard
              key={i}
              title={c.title}
              date={c.date}
              category={c.category}
              onView={() => console.log(`Viewing case: ${c.title}`)}
              onEdit={() => console.log(`Editing case: ${c.title}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ManageCases;
