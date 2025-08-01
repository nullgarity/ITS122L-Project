import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import app from "../services/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Simple admin check - you can modify this logic based on your needs
      // For now, checking if email contains 'admin'
      setIsAdmin(user?.email?.includes("admin") || false);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
