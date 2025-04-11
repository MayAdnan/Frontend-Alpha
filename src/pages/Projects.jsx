import React, { useState, useEffect, use } from "react";
import ModalButton from "../partials/components/ModalButton";
import ProjectCards from "../partials/sections/ProjectCards";
import ProjectForm from "../partials/sections/ProjectForm";
import Modal from "../partials/sections/Modal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [currentProject, setCurrentProject] = useState(null);
  const [newProject, setNewProject] = useState({
    title: "",
    image: "",
    projectName: "",
    clientName: "",
    description: "",
    startDate: "",
    endDate: "",
    projectOwner: "",
    budget: null,
    usersId: "",
  });

  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("https://localhost:5173/api/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY,
        },
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("https://localhost:5173/api/clients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY,
        },
      });
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://localhost:5173/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddProject = async (project) => {
    try {
      const response = await fetch("https://localhost:5173/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(project),
      });
      const newProject = await response.json();
      setProjects([...projects, newProject]);
      closeModal();
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleEditProject = async (updatedProject) => {
    try {
      const response = await fetch(
        `https://localhost:5173/api/projects/${updatedProject.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify(updatedProject),
        }
      );
      if (response.ok) {
        setProjects(
          projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
        );
        closeModal();
      }
    } catch (error) {
      console.error("Error editing project:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(
        `https://localhost:5173/api/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_API_KEY,
          },
        }
      );
      if (response.ok) {
        setProjects(projects.filter((project) => project.id !== projectId));
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const getFilteredProjects = () => {
    if (filter === "Completed") {
      return projects.filter(
        (project) => project.status?.statusName === "Completed"
      );
    }
    return projects;
  };

  const openModal = (project = null) => {
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
  };

  return (
    <div id="projects">
      <div className="page-header">
        <h1 className="h2">Projects</h1>
        <ModalButton
          type="primary"
          target="#addProjectModal"
          text="Add Project"
          onClick={() => openModal()}
        />
      </div>
      <div className="filter-buttons-wrapper">
        <div className="filter-buttons">
          <button
            className={`filter-button ${filter === "All" ? "active" : ""}`}
            onClick={() => setFilter("All")}
          >
            All ({projects.length})
          </button>
          <button
            className={`filter-button ${
              filter === "Completed" ? "active" : ""
            }`}
            onClick={() => setFilter("Completed")}
          >
            Completed (
            {
              projects.filter(
                (project) => project.status?.statusName === "Completed"
              ).length
            }
            )
          </button>
        </div>
      </div>
      <div className="project-list">
        {getFilteredProjects().length === 0 ? (
          <p>No projects available.</p>
        ) : (
          <div className="project-grid">
            {getFilteredProjects().map((project) => (
              <ProjectCards
                key={project.id}
                title={project.projectName}
                description={project.description}
                company={project.client?.clientName}
                logo={project.image}
                status={project.status?.statusName}
                onEdit={() => openModal(project)}
                onDelete={() => handleDeleteProject(project.id)}
                onComplete={() =>
                  handleEditProject({
                    ...project,
                    statusId: { statusName: "Completed" },
                  })
                }
              />
            ))}
          </div>
        )}
      </div>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <h2>{currentProject ? "Edit Project" : "Add Project"}</h2>
          <ProjectForm
            project={currentProject}
            clients={clients}
            users={users}
            onSubmit={currentProject ? handleEditProject : handleAddProject}
          />
        </Modal>
      )}
    </div>
  );
};

export default Projects;
