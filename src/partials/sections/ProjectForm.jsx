import React, { useState, useEffect } from "react";

const ProjectForm = ({ project, onSubmit }) => {
  const [image, setImage] = useState("");
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    if (project) {
      setImage(project.image);
      setProjectName(project.projectName);
      setClientName(project.clientName);
      setStartDate(project.startDate);
      setEndDate(project.endDate);
      setProjectOwner(project.projectOwner);
      setBudget(project.budget);
    } else {
      setImage("");
      setProjectName("");
      setClientName("");
      setStartDate("");
      setEndDate("");
      setProjectOwner("");
      setBudget("");
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...project,
      image,
      projectName,
      clientName,
      startDate,
      endDate,
      projectOwner,
      budget,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="image">Image</label>
        <input
          id="image"
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Enter image URL"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="projectName">Project Name</label>
        <input
          id="projectName"
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="clientName">Client Name</label>
        <input
          id="clientName"
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Enter client name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="startDate">Start Date</label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="endDate">End Date</label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="projectOwner">Project Owner</label>
        <input
          id="projectOwner"
          type="text"
          value={projectOwner}
          onChange={(e) => setProjectOwner(e.target.value)}
          placeholder="Enter project owner"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="budget">Budget</label>
        <input
          id="budget"
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Enter budget"
          required
        />
      </div>
      <button className="btn btn-submit" type="submit">
        {project ? "Update Project" : "Add Project"}
      </button>
    </form>
  );
};

export default ProjectForm;
