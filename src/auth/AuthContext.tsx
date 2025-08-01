import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import app from "../services/firebase";

// 👇 Your app's user structure (Firebase User)
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);

    // ✅ DEV BYPASS — insert fake user if in development mode
    if (import.meta.env.DEV) {
      const fakeUser = {
        uid: "dev123",
        email: "dev@example.com",
        displayName: "Developer",
      } as User;

      setUser(fakeUser);
      setIsAdmin(false); // or true, if testing admin view
      setLoading(false);
      return;
    }

    // 🔐 REAL auth for production or when DEV is false
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
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
