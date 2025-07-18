import React from "react";

type UserCardProps = {
  fullName: string;
  email: string;
  role: string;
  onManage?: () => void;
};

const UserCard: React.FC<UserCardProps> = ({ fullName, email, role, onManage }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
      <h3 className="text-lg font-bold">{fullName}</h3>
      <p className="text-sm text-gray-600">{email}</p>
      <p className="text-sm text-gray-500">Role: {role}</p>
      {onManage && (
        <button
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onManage}
        >
          Manage
        </button>
      )}
    </div>
  );
};

export default UserCard;