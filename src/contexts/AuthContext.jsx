import React, { createContext, useContext, useState, useEffect } from "react";

const apiEndpoint = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5173"
}/admin/projects`;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (formData) => {
    const response = await fetch(`${apiEndpoint}/signup`, {
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
      const response = await fetch(`${apiEndpoint}/signin`, {
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
    const response = await fetch(`${apiEndpoint}/signout`, {
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
    <AuthContext.Provider value={{ loading, user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
