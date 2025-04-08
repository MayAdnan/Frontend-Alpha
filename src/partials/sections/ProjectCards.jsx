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
              <button className="dropdown-item" onClick={onEdit}>
                <span role="img" aria-label="edit">
                  ✏️
                </span>{" "}
                Edit
              </button>
              <button className="dropdown-item delete" onClick={onDelete}>
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
