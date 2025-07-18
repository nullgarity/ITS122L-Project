import React from "react";

type CaseViewerProps = {
  caseData: {
    title: string;
    category: string;
    date: string;
    description?: string;
  };
};

const CaseViewer: React.FC<CaseViewerProps> = ({ caseData }) => {
  return (
    <div className="flex gap-6">
      {/* Left side: Case details */}
      <div className="flex-1 bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Case Details</h2>
        <p><strong>Title:</strong> {caseData.title}</p>
        <p><strong>Category:</strong> {caseData.category}</p>
        <p><strong>Date:</strong> {caseData.date}</p>
        {caseData.description && <p><strong>Description:</strong> {caseData.description}</p>}
      </div>

      {/* Right side: PDF preview */}
      <div className="w-1/2 bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Documents</h3>
        <div className="border h-[500px] bg-gray-100 flex items-center justify-center text-gray-500">
          PDF Preview Placeholder
        </div>
      </div>
    </div>
  );
};

export default CaseViewer;
