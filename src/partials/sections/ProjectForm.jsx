import React, { useState, useEffect } from "react";

const ProjectForm = ({ project, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...project, title, description });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit">
        {project ? "Update Project" : "Add Project"}
      </button>
    </form>
  );
};

export default ProjectForm;
