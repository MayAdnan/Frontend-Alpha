import React, { useState, useEffect } from "react";
import ModalButton from "../partials/components/ModalButton";
import ProjectCards from "../partials/sections/ProjectCards";
import Modal from "../partials/sections/Modal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterd, setFilterd] = useState("All");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [newProject, setNewProject] = useState(primeProjectState());

  function primeProjectState() {
    return {
      image: "",
      imageFile: null,
      projectName: "",
      clientId: "",
      description: "",
      startDate: "",
      endDate: "",
      budget: null,
      userId: "",
    };
  }

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    const response = await fetch(`https://localhost:7297/api/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setProjects(data);
    }
  };

  const fetchClients = async () => {
    const response = await fetch(`https://localhost:7297/api/clients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setClients(data);
    }
  };

  const fetchUsers = async () => {
    const response = await fetch(`https://localhost:7297/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  const handleEditProject = (project) => {
    setIsEditMode(true);
    setEditProjectId(project.id);
    setNewProject({
      image: project.image || "",
      projectName: project.projectName,
      clientId: project.client?.id || "",
      description: project.description || "",
      startDate: project.startDate.split("T")[0],
      endDate: project.endDate ? project.endDate.split("T")[0] : "",
      budget: project.budget || null,
      userId: project.user?.id || "",
      created: project.created,
      statusId: project.status?.id || 1,
    });
    setIsModalOpen(true);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!newProject.projectName) {
      errors.projectName = "Project name is required";
    }
    // if (!newProject.clientId) {
    //   errors.clientId = "Client must be selected.";
    // }
    // if (!newProject.userId) {
    //   errors.userId = "Project Owner must be selected.";
    // }
    if (!newProject.startDate) {
      errors.startDate = "Start date is required";
    }

    if (Object.keys(errors).length > 0) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("Id", editProjectId || 0);

    if (newProject.imageFile) {
      formData.append("NewImage", newProject.imageFile);
    } else if (newProject.image) {
      formData.append("Image", newProject.image);
    }
    formData.append("ProjectName", newProject.projectName);
    formData.append("Description", newProject.description);
    formData.append("StartDate", newProject.startDate);
    formData.append("EndDate", newProject.endDate);
    formData.append(
      "Budget",
      newProject.budget !== null ? newProject.budget : ""
    );
    formData.append("ClientId", newProject.clientId);
    formData.append("UserId", newProject.userId);
    formData.append("StatusId", newProject.statusId || 1);
    formData.append("Created", newProject.created || new Date().toISOString());

    const response = await fetch(`https://localhost:7297/api/projects`, {
      method: "PUT",
      headers: {
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: formData,
    });

    if (response.ok) {
      await fetchProjects();
    }
    setNewProject(primeProjectState());
    setIsModalOpen(false);
    setEditProjectId(null);
    setIsEditMode(false);
  };

  const handleDeleteProject = (projectId) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== projectId)
    );
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!newProject.projectName.trim()) {
      errors.projectName = "Project name is required.";
    }
    if (!newProject.startDate) {
      errors.startDate = "Start date is required.";
    }
    if (!newProject.clientId) {
      errors.clientId = "Client must be selected.";
    }
    if (!newProject.userId) {
      errors.userId = "Project Owner must be selected.";
    }

    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors).join("\n"));
      return;
    }

    const formData = new FormData();
    formData.append("Image", newProject.imageFile || "");
    formData.append("ProjectName", newProject.projectName);
    formData.append("Description", newProject.description || "");
    formData.append("StartDate", newProject.startDate);
    formData.append("EndDate", newProject.endDate || "");
    formData.append(
      "Budget",
      newProject.budget !== null ? newProject.budget : ""
    );
    formData.append("ClientId", newProject.clientId);
    formData.append("UserId", newProject.userId);
    formData.append("Created", newProject.created || new Date().toISOString());

    const response = await fetch(`https://localhost:7297/api/projects`, {
      method: "POST",
      headers: {
        "X-API-KEY": import.meta.env.VITE_X_API_KEY,
      },
      body: formData,
    });
    if (response.ok) {
      await fetchProjects();
    }
    setNewProject(primeProjectState());
    setIsModalOpen(false);
  };

  const getFilteredProjects = projects.filter((project) => {
    if (filterd === "completed") {
      return project.status.id === 2;
    }
    return true;
  });

  return (
    <div id="projects">
      <div className="page-header">
        <h1 className="h2">Projects</h1>
        <ModalButton
          type="add"
          target="#addProjectModal"
          text="Add Project"
          className="btn"
          onClick={() => {
            setIsEditMode(false);
            setIsModalOpen(true);
            setNewProject(primeProjectState());
          }}
        />
      </div>
      <div className="tabs">
        <button
          className={filterd === "All" ? "active" : ""}
          onClick={() => setFilterd("All")}
        >
          ALL [
          {
            projects.filter(
              (project) => project.status.id === 1 || project.status.id === 2
            ).length
          }
          ]
        </button>
        <button
          className={filterd === "Completed" ? "active" : ""}
          onClick={() => setFilterd("Completed")}
        >
          COMPLETED [
          {projects.filter((project) => project.status.id === 2).length}]
        </button>
      </div>
      <div className="containerproject">
        {filterd === "all"
          ? projects.map((p) => (
              <ProjectCards
                key={p.id}
                project={p}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                className="card"
              />
            ))
          : getFilteredProjects.map((p) => (
              <ProjectCards
                key={p.id}
                project={p}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                className="card"
              />
            ))}
      </div>
      {isModalOpen && (
        <Modal
          id="addProjectModal"
          title={isEditMode ? "Edit Project" : "Add Project"}
          isOpen={isModalOpen}
          onClose={() => {
            setNewProject(primeProjectState());
            setIsModalOpen(false);
          }}
          className="modal"
        >
          <form
            noValidate
            onSubmit={isEditMode ? handleUpdateProject : handleAddProject}
            encType="multipart/form-data"
            className="form"
          >
            <div className="form-group image-picker">
              <div
                className="image-picker-container"
                onClick={() => document.getElementById("imageInput").click()}
              >
                {newProject.image ? (
                  <img
                    src={newProject.image}
                    alt="Selected"
                    className="selected-image"
                  />
                ) : (
                  <i className="camera-icon fa fa-camera"></i>
                )}
              </div>
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setNewProject({
                        ...newProject,
                        image: event.target.result,
                        imageFile: file,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="projectName" className="form-label">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                className="form-input"
                value={newProject.projectName}
                onChange={(e) =>
                  setNewProject({ ...newProject, projectName: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="clientId" className="form-label">
                Client Name
              </label>
              <select
                id="clientId"
                className="form-select"
                value={newProject.clientId}
                onChange={(e) =>
                  setNewProject({ ...newProject, clientId: e.target.value })
                }
              >
                <option value="">Select Client Name</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.clientName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                className="form-textarea"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                className="form-input"
                value={newProject.startDate}
                onChange={(e) =>
                  setNewProject({ ...newProject, startDate: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate" className="form-label">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                className="form-input"
                value={newProject.endDate}
                onChange={(e) =>
                  setNewProject({ ...newProject, endDate: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="userId" className="form-label">
                Project Owner
              </label>
              <select
                id="userId"
                className="form-select"
                value={newProject.userId}
                onChange={(e) =>
                  setNewProject({ ...newProject, userId: e.target.value })
                }
              >
                <option value="">Select Project Owner</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="budget" className="form-label">
                Budget
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  id="budget"
                  className="form-input"
                  placeholder="0"
                  value={newProject.budget === null ? "" : newProject.budget}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      budget:
                        e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <button type="submit" className="btn">
              {isEditMode ? "Update Project" : "Add Project"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Projects;
