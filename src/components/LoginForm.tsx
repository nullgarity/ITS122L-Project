// src/components/LoginForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
  Divider,
} from "@mui/material";
import { login, signUp } from "../services/authService";
import { useAuth } from "../auth/AuthContext";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading } = useAuth();

  // Set initial mode based on route
  const [isSignUp, setIsSignUp] = useState(location.pathname === "/signup");

  // Update mode when route changes
  useEffect(() => {
    setIsSignUp(location.pathname === "/signup");
  }, [location.pathname]);

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
        sx={{ bgcolor: "#f5f5f5" }}
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
    setSuccess("");

    try {
      if (isSignUp) {
        // Sign up logic
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters long");
          setIsLoading(false);
          return;
        }

        const result = await signUp(email, password);
        if (result.success) {
          setSuccess(
            "Account created successfully! Please sign in with your credentials."
          );
          setIsSignUp(false); // Switch back to login mode
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        } else {
          setError(result.message || "Failed to create account");
        }
      } else {
        // Login logic
        const result = await login(email, password);
        if (result.success) {
          // Navigation will be handled by the useEffect hook above
        } else {
          setError(result.message || "Login failed");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    // Navigate to the appropriate route
    if (isSignUp) {
      navigate("/login");
    } else {
      navigate("/signup");
    }
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
            {isSignUp
              ? "Create a new account"
              : "Sign in to access your dashboard"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
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
              autoComplete={isSignUp ? "new-password" : "current-password"}
              helperText={
                isSignUp ? "Password must be at least 6 characters" : ""
              }
            />

            {isSignUp && (
              <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                margin="normal"
                autoComplete="new-password"
                helperText="Re-enter your password to confirm"
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box textAlign="center">
            <Typography variant="body2" color="textSecondary" mb={2}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </Typography>
            <Link
              component="button"
              variant="body2"
              onClick={toggleMode}
              sx={{
                textDecoration: "none",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Link>
          </Box>

          {!isSignUp && (
            <Typography
              variant="caption"
              color="textSecondary"
              textAlign="center"
              display="block"
              mt={3}
            >
              🔑 Admin access: email must contain "admin"
              <br />
              👤 User access: any other email address
            </Typography>
          )}

          {isSignUp && (
            <Typography
              variant="caption"
              color="textSecondary"
              textAlign="center"
              display="block"
              mt={3}
            >
              ℹ️ After creating your account, you'll be redirected to sign in
              <br />
              🔑 Use an email containing "admin" for admin access
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;
