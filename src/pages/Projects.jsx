import React, { useState } from "react";
import ModalButton from "../partials/components/ModalButton";
import ProjectCards from "../partials/sections/ProjectCards";
import ProjectForm from "../partials/sections/ProjectForm";
import Modal from "../partials/sections/Modal";
import Icon_BlueGreen from "../assets/images/ProjectsIcons/Icon_BlueGreen.svg";
import Icon_DarkOrange from "../assets/images/ProjectsIcons/Icon_DarkOrange.svg";

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "ASP.NET Web App",
      description:
        "You need to create a web application that simulates a project.",
      clientName: "EF Core Inc.",
      image: Icon_BlueGreen,
      status: "In Progress",
    },
    {
      id: 2,
      title: "Website Redesign",
      description:
        "It is necessary to develop a website redesign in a corporate style.",
      clientName: "Nackademin",
      image: Icon_DarkOrange,
      status: "Completed",
    },
  ]);
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

  const handleAddProject = (project) => {
    setProjects([...projects, { ...project, id: Date.now() }]);
    closeModal();
  };

  const handleEditProject = (updatedProject) => {
    setProjects(
      projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
    closeModal();
  };

  const getFilteredProjects = () => {
    if (filter === "Completed") {
      return projects.filter((project) => project.status === "Completed");
    }
    return projects;
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  const openModal = (project = null) => {
    console.log(project);
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
              projects.filter((project) => project.status === "Completed")
                .length
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
                title={project.title}
                description={project.description}
                company={project.clientName}
                logo={project.image}
                status={project.status}
                onEdit={() => openModal(project)}
                onDelete={() => handleDeleteProject(project.id)}
                onComplete={() =>
                  setProjects(
                    projects.map((p) =>
                      p.id === project.id ? { ...p, status: "Completed" } : p
                    )
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2>{currentProject ? "Edit Project" : "Add Project"}</h2>
          <ProjectForm
            project={currentProject}
            onSubmit={currentProject ? handleEditProject : handleAddProject}
          />
        </Modal>
      )}
    </div>
  );
};

export default Projects;
