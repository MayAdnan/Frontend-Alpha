import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const { signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(
        `https://localhost:5173/api/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_API_KEY,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetchUserDetails(parsedUser.id);
    }
  }, []);

  const handleSignOut = () => {
    signOut();
    localStorage.removeItem("authUser");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">Project Management</div>
        <div className="user-info" onClick={toggleDropdown}>
          {user && (
            <img
              src={user.image || "default-logo.png"}
              alt="User"
              className="user-avatar"
            />
          )}
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <img
                  src={user?.image || "default-logo.png"}
                  alt="User"
                  className="user-avatar"
                />{" "}
                <p className="user-name">{`${user.firstName} ${user.lastName}`}</p>
              </div>
              <button className="dropdown-item" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
