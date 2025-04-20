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
        `https://alpa-portal-webapp.azurewebsites.net/api/projects/${project.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY,
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
        <img
          src={project.image || "default-logo.png"}
          className="project-image"
        />
        <div
          className="project-actions"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <button type="button" className="ellipsis" onClick={toggleDropdown}>
            {" "}
            <i className="fa-solid fa-ellipsis"></i>{" "}
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item dropdown-item-edit"
                onClick={handleEdit}
              >
                <i className="fa-solid fa-pen"></i> Edit
              </button>
              <button
                className="dropdown-item dropdown-item-delete"
                onClick={handleDelete}
              >
                <i className="fa-solid fa-trash"></i> Delete Project
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="project-card-body">
        <h3 className="project-title">{project.projectName}</h3>
        <p className="project-client">{project.client?.clientName}</p>
        <p className="project-description">{project.description}</p>
      </div>
    </div>
  );
};

export default ProjectCards;
