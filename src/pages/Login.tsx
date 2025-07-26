import React from "react";
import LoginForm from "../components/LoginForm";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-container">
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}