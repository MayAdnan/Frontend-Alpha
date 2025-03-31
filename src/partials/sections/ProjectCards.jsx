import React from "react";

const ProjectCards = ({
  title,
  description,
  company,
  logo,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <img
          src={logo || "default-logo.png"}
          alt={`${title} logo`}
          className="project-logo"
        />
        <div className="project-actions">
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      </div>
      <div className="project-card-body">
        <h3 className="project-title">{title}</h3>
        <p className="project-company">{company}</p>
        <p className="project-description">{description}</p>
      </div>
    </div>
  );
};

export default ProjectCards;
