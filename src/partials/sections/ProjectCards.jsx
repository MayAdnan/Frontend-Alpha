import React, { useState } from "react";

const ProjectCards = ({ project, onDelete, onEdit }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEdit = () => {
    onEdit(project);
    setIsDropdownOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://localhost:5173/api/projects/${project.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_API_KEY,
          },
        }
      );
      if (response.ok) {
        onDelete(project.id);
        setIsDropdownOpen(false);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="project-card">
      <div className="project-card-header">
        <img src={project.img || "default-logo.png"} className="project-logo" />
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
        <h3 className="project-title">{project.ProjectName}</h3>
        <p className="project-client">{project.client?.clientName}</p>
        <p className="project-description">{project.description}</p>
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
