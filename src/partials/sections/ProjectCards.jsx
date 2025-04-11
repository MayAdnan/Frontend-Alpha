import React, { useState } from "react";

const ProjectCards = ({
  title,
  description,
  company,
  logo,
  onEdit,
  onDelete,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEdit = () => {
    onEdit(); // Removed 'project' as it is undefined in the current context
    setIsDropdownOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://localhost:5173/api/projects/${project.id}`, // Ensure 'project' is passed as a prop or defined
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_API_KEY,
          },
        }
      );
      if (response.ok) {
        onDelete(project.id); // Ensure 'project' is passed as a prop or defined
        setIsDropdownOpen(false);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="project-card">
      <div className="project-card-header">
        <img
          src={logo || "default-logo.png"}
          alt={`${title} logo`}
          className="project-logo"
        />
        <div className="project-actions">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            &#x22EE; {/* Vertical ellipsis icon */}
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleEdit}>
                <span role="img" aria-label="edit">
                  ✏️
                </span>{" "}
                Edit
              </button>
              <button className="dropdown-item delete" onClick={handleDelete}>
                <span role="img" aria-label="delete">
                  🗑️
                </span>{" "}
                Delete Project
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="project-card-body">
        <h3 className="project-title">{title}</h3>
        <p className="project-company">{company}</p>
        <p className="project-description">{description}</p>
        <p
          className={`project-status ${
            status === "Completed" ? "completed" : "in-progress"
          }`}
        >
          Status: {status}
        </p>
      </div>
    </div>
  );
};

export default ProjectCards;
