import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Admin Dashboard</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>
            Welcome, {user?.email ? user.email.split("@")[0] : "Admin"}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>Admin Panel</h2>
        <p>You have successfully logged in as an administrator.</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
            }}
          >
            <h3>Manage Users</h3>
            <p>View and manage user accounts</p>
          </div>
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
            }}
          >
            <h3>Manage Cases</h3>
            <p>Oversee all cases in the system</p>
          </div>
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
            }}
          >
            <h3>System Settings</h3>
            <p>Configure system-wide settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
