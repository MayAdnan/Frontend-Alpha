import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("admin");

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (formData) => {
    const response = await fetch(`https://localhost:7297/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to sign up");
    }

    return true;
  };

  const signIn = async (email, password) => {
    try {
      const response = await fetch(`https://localhost:7297/api/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return false;
      }

      setUser(data.user);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      return true;
    } catch (error) {
      console.error("Error during sign-in:", error);
      return false;
    }
  };

  const signOut = async () => {
    const response = await fetch(`https://localhost:7297/api/signout`, {
      method: "POST",
      headers: {
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
    });

    if (response.ok) {
      setUser(null);
      localStorage.removeItem("authUser");
    }
  };

  return (
    <AuthContext.Provider
      value={{ loading, role, user, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
