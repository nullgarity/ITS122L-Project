import React from "react";

type UserCasesListProps = {
  cases: {
    id: string;
    title: string;
    category: string;
    date: string;
  }[];
};

const UserCasesList: React.FC<UserCasesListProps> = ({ cases }) => {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">User Cases</h3>
      {cases.length === 0 ? (
        <p className="text-gray-500">No cases found.</p>
      ) : (
        <ul className="space-y-3">
          {cases.map((c) => (
            <li key={c.id} className="border p-3 rounded">
              <p><strong>{c.title}</strong></p>
              <p className="text-sm text-gray-600">
                {c.category} • {c.date}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserCasesList;
