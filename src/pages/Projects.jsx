import React, { useState, useEffect } from "react";
import ModalButton from "../partials/components/ModalButton";
import ProjectCards from "../partials/sections/ProjectCards";
import Modal from "../partials/sections/Modal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
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

  const fetchProjects = async () => {
    const response = await fetch("https://localhost:5173/api/projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_API_KEY,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setProjects(data);
    }
  };
  const fetchClients = async () => {
    const response = await fetch("https://localhost:5173/api/clients", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_API_KEY,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setClients(data);
    }
  };

  const fetchUsers = async () => {
    const response = await fetch("https://localhost:5173/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": import.meta.env.VITE_API_KEY,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };
  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchUsers();
  }, []);

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

    const formData = new FormData();
    formData.append("Id", editProjectId || 0);
    formData.append("ProjectName", newProject.projectName);
    formData.append("ClientId", newProject.clientId);
    formData.append("Description", newProject.description);
    formData.append("StartDate", newProject.startDate);
    formData.append("EndDate", newProject.endDate);
    formData.append(
      "Budget",
      newProject.budget !== null ? newProject.budget : ""
    );
    formData.append("UserId", newProject.userId);
    formData.append("StatusId", newProject.statusId || 1);
    formData.append("Created", newProject.created || new Date().toISOString());

    if (newProject.imageFile) {
      formData.append("Image", newProject.imageFile, newProject.imageFile);
    } else if (newProject.image) {
      formData.append("Image", newProject.image);
    }

    const method = isEditMode ? "PUT" : "POST";
    const response = await fetch("https://localhost:5173/api/projects", {
      method: method,
      headers: {
        "X-API-KEY": import.meta.env.VITE_API_KEY,
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

  const getFilteredProjects = projects.filter((project) => {
    if (filter === "completed") {
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
          text="Add Project"
          onClick={() => {
            setIsModalOpen(true);
            setNewProject(primeProjectState());
            setIsEditMode(false);
          }}
        />
      </div>
      <div className="tabs">
        <button
          className={filter === "All" ? "active" : ""}
          onClick={() => setFilter("All")}
        >
          All ({projects.length})
        </button>
        <button
          className={filter === "Completed" ? "active" : ""}
          onClick={() => setFilter("Completed")}
        >
          Completed (
          {projects.filter((project) => project.status.id === 2).length})
        </button>
      </div>
      <div className="containerproject">
        {getFilteredProjects.map((p) => (
          <ProjectCards
            key={p.id}
            project={p}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>
      <Modal
        id="addProjectModal"
        title={isEditMode ? "Edit Project" : "Add Project"}
        isOpen={isModalOpen}
        onClose={() => {
          setNewProject(primeProjectState());
          setIsModalOpen(false);
        }}
      >
        <form
          noValidate
          onSubmit={handleUpdateProject}
          encType="multipart/form-data"
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
            <label htmlFor="projectName">Project Name</label>
            <input
              type="text"
              id="projectName"
              value={newProject.projectName}
              onChange={(e) =>
                setNewProject({ ...newProject, projectName: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="clientId">Client Name</label>
            <select
              id="clientId"
              value={newProject.clientId}
              onChange={(e) =>
                setNewProject({ ...newProject, clientId: e.target.value })
              }
              required
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
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={newProject.startDate}
              onChange={(e) =>
                setNewProject({ ...newProject, startDate: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              value={newProject.endDate}
              onChange={(e) =>
                setNewProject({ ...newProject, endDate: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="userId">Project Owner</label>
            <select
              id="userId"
              value={newProject.userId}
              onChange={(e) =>
                setNewProject({ ...newProject, userId: e.target.value })
              }
              required
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
            <label htmlFor="budget"> Budget</label>
            <input
              type="number"
              id="budget"
              plackeholder="0"
              value={newProject.budget === null ? "" : newProject.budget}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  budget: e.target.value === "" ? null : Number(e.target.value),
                })
              }
            />
          </div>
          <button type="submit">
            {isEditMode ? "Update Project" : "Add Project"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
