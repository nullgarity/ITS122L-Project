import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import routes from "./routes";

function AppRoutes() {
  const element = useRoutes(routes);
  return element ?? null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
