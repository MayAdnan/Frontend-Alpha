import React, { useState, useEffect, use } from "react";

const ProjectForm = ({ project, clients, users, onSubmit }) => {
  const [formData, setFormData] = useState({
    image: "",
    newImage: "",
    projectName: "",
    clientId: "",
    userId: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: null,
    statusId: 1,
  });

  useEffect(() => {
    if (project) {
      setFormData({
        image: project.image || "",
        newImage: project.newImage || "",
        projectName: project.projectName || "",
        clientId: project.client?.id || "",
        userId: project.userId || "",
        description: project.description || "",
        startDate: project.startDate.split("T")[0] || "",
        endDate: project.endDate.split("T")[0] || "",

        budget: project.budget || null,
        statusId: project.status?.id || 1,
        id: project.id,
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          name="image"
          value={formData.image}
          type="file"
          onChange={handleChange}
          placeholder="Image here"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="projectName">Project Name</label>
        <input
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
          placeholder="Project Name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="clientName">Client Name</label>
        <input
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
          placeholder="Enter client name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
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
