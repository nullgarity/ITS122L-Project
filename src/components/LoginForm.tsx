// src/components/LoginForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../auth/AuthContext";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(isAdmin ? "/admin/dashboard" : "/user/dashboard");
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(email, password);

    if (result.success) {
      // Navigation will be handled by the useEffect hook above
      // once the auth state updates
    } else {
      setError(result.message || "Login failed");
    }

    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "10px",
            backgroundColor: isLoading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
