import React, { createContext, useContext, useState } from "react";
import { defaultValues } from "./authConstants";

const apiEndpoint = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5173"
}/admin/projects`;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(defaultValues);

  const signUp = async (formData) => {
    const response = await fetch(`${apiEndpoint}/signup`, {
      method: "POST",
      headers: {
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to sign up");
    }

    return true;
  };

  const signIn = async (email, password) => {
    const response = await fetch(`${apiEndpoint}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setAuthState({
        accessToken: data.accessToken,
        role: data.role,
        isAuthenticated: true,
        loading: false,
      });
    } else {
      throw new Error("Failed to sign in");
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
      setAuthState(defaultValues);
    } else {
      throw new Error("Failed to sign out");
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
