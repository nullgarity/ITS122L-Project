// src/components/LoginForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { login } from "../services/authService";
import { useAuth } from "../auth/AuthContext";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(isAdmin ? "/admin/dashboard" : "/user/dashboard");
    }
  }, [user, isAdmin, navigate]);

  // Show loading state
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
        <Typography ml={2}>Loading authentication...</Typography>
      </Box>
    );
  }

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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ bgcolor: "#f5f5f5", p: 2 }}
    >
      <Card sx={{ maxWidth: 500, width: "100%" }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" textAlign="center" mb={1}>
            Legal Case Management
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            color="textSecondary"
            mb={4}
          >
            Sign in to access your dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              autoComplete="email"
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="textSecondary"
            textAlign="center"
            display="block"
            mt={2}
          >
            🔑 Admin access: email must contain "admin"
            <br />
            👤 User access: any other email address
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;
