import React from "react";

type Props = {
  title: string;
  dateFiled: string;
  status: string;
  onView?: () => void;
};

const CaseCard: React.FC<Props> = ({ title, dateFiled, status, onView }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
      <h4 className="font-semibold text-lg">{title}</h4>
      <p className="text-sm text-gray-600">Filed: {dateFiled}</p>
      <p className="text-sm text-gray-500">Status: {status}</p>
      {onView && (
        <button
          onClick={onView}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          View Case
        </button>
      )}
    </div>
  );
};

export default CaseCard;