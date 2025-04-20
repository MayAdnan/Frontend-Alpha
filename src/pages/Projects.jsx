import React, { useState, useEffect } from "react";
import ModalButton from "../partials/components/ModalButton";
import ProjectCards from "../partials/sections/ProjectCards";
import Modal from "../partials/sections/Modal";
import dollar from "../assets/images/dollar.svg";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtered, setFiltered] = useState("ALL");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [statuses, setStatuses] = useState([]);

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
      created: null,
      statusId: 1,
    };
  }

  const [newProject, setNewProject] = useState(primeProjectState());

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchUsers();
    fetchStatuses();
  }, []);

  const fetchProjects = async () => {
    const response = await fetch(
      `https://alpa-portal-webapp.azurewebsites.net/api/projects`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setProjects(data);
    }
  };

  const fetchClients = async () => {
    const response = await fetch(
      `https://alpa-portal-webapp.azurewebsites.net/api/clients`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setClients(data);
    }
  };

  const fetchUsers = async () => {
    const response = await fetch(
      `https://alpa-portal-webapp.azurewebsites.net/api/users`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  const handleEditProject = (project) => {
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
    setIsEditMode(true);
    setEditProjectId(project.id);
    setIsModalOpen(true);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!newProject.projectName) {
      errors.projectName = "Project name is required";
    }
    if (!newProject.clientId) {
      errors.clientId = "Client must be selected.";
    }
    if (!newProject.userId) {
      errors.userId = "Project Owner must be selected.";
    }
    if (!newProject.startDate) {
      errors.startDate = "Start date is required";
    }

    if (Object.keys(errors).length > 0) {
      alert("Please fill in all required fields.");
      return;
    }

    const projectData = {
      Id: editProjectId || 0,
      Image: newProject.imageFile ? newProject.imageFile : newProject.image,
      ProjectName: newProject.projectName,
      Description: newProject.description,
      StartDate: newProject.startDate,
      EndDate: newProject.endDate || null,
      Budget: newProject.budget !== null ? newProject.budget : "",
      ClientId: newProject.clientId,
      UserId: newProject.userId,
      StatusId: newProject.statusId || 1,
      Created: newProject.created || new Date().toISOString(),
    };

    const response = await fetch(
      `https://alpa-portal-webapp.azurewebsites.net/api/projects`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
        body: JSON.stringify(projectData),
      }
    );

    if (response.ok) {
      await fetchProjects();
    }
    setNewProject(primeProjectState());
    setIsModalOpen(false);
    setEditProjectId(null);
    setIsEditMode(false);
  };

  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmed) return;

    setProjects(projects.filter((project) => project.id !== projectId));

    const response = await fetch(
      `https://alpa-portal-webapp.azurewebsites.net/api/projects/${projectId}`,
      {
        method: "DELETE",
        headers: {
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
      }
    );

    if (response.ok) {
      await fetchProjects();
    }
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

    const projectData = {
      Image: newProject.image || "",
      ProjectName: newProject.projectName,
      Description: newProject.description || "",
      StartDate: newProject.startDate,
      EndDate: newProject.endDate || "",
      Budget: newProject.budget !== null ? newProject.budget : "",
      ClientId: newProject.clientId,
      UserId: newProject.userId,
      Created: newProject.created || new Date().toISOString(),
    };

    const response = await fetch(
      `https://alpa-portal-webapp.azurewebsites.net/api/projects`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
        body: JSON.stringify(projectData),
      }
    );

    if (response.ok) {
      await fetchProjects();
    }
    setNewProject(primeProjectState());
    setIsModalOpen(false);
  };

  const getFilteredProjects =
    filtered === "COMPLETED"
      ? projects.filter((project) => project.status?.id === 2)
      : projects;

  const fetchStatuses = async () => {
    const response = await fetch(
      `https://alpa-portal-webapp.azurewebsites.net/api/status`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setStatuses(data);
    }
  };

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
            setNewProject(primeProjectState());
            setIsModalOpen(true);
          }}
        />
      </div>
      <div className="tabs">
        <button
          className={filtered === "ALL" ? "active" : ""}
          onClick={() => setFiltered("ALL")}
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
          className={filtered === "COMPLETED" ? "active" : ""}
          onClick={() => setFiltered("COMPLETED")}
        >
          COMPLETED [
          {projects.filter((project) => project.status.id === 2).length}]
        </button>
      </div>
      <div className="containerproject">
        {filtered === "ALL"
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
        >
          <div className="modal-content">
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
                    <div>
                      <i className="camera-icon fa fa-camera"></i>
                    </div>
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
                        console.log("Image loaded:", event.target.result);
                        setNewProject((prev) => ({
                          ...prev,
                          imageFile: null,
                          image: event.target.result, // Base64 string, hjälp av AI
                        }));
                      };
                      reader.readAsDataURL(file);
                    } else {
                      console.log("No file selected");
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
                    setNewProject({
                      ...newProject,
                      projectName: e.target.value,
                    })
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
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
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
                    setNewProject({
                      ...newProject,
                      startDate: e.target.value,
                    })
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

                <div className="input-group" id="project-budget">
                  <img className="dollar-img" src={dollar} alt="" />
                  <input
                    type="number"
                    id="budget"
                    className="form-input"
                    min={"0"}
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

              {isEditMode && (
                <div className="form-group">
                  <label htmlFor="project-status" className="form-label">
                    Project Status
                  </label>
                  <select
                    name="project-status"
                    id="project-status"
                    className="form-select"
                    value={newProject.statusId}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        statusId: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value="1">Started</option>
                    <option value="2">Completed</option>
                    {statuses
                      .filter(
                        (status) =>
                          status.name === "Started" ||
                          status.name === "Completed"
                      )
                      .map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <button type="submit" className="btn btn-create">
                {isEditMode ? "Update Project" : "Add Project"}
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Projects;
