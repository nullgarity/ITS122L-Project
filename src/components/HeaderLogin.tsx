import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <div className="text-xl font-semibold">Case Management System</div>
      {/* Navigation or role-specific items go in separate components */}
    </header>
  );
};

export default Header;
