import React, { useState } from "react";
import ModalButton from "../partials/components/ModalButton";
import ProjectCards from "../partials/sections/ProjectCards";
import ProjectForm from "../partials/sections/ProjectForm";
import Modal from "../partials/sections/Modal";

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "ASP.NET Web App",
      description:
        "You need to create a web application that simulates a project.",
      clientName: "EF Core Inc.",
      image: "https://via.placeholder.com/40",
    },
    {
      id: 2,
      title: "Website Redesign",
      description:
        "It is necessary to develop a website redesign in a corporate style.",
      clientName: "GitLab Inc.",
      image: "https://via.placeholder.com/40",
    },
  ]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    budget: "",
    usersId: "",
  });

  const handleAddProject = (project) => {
    setNewProject([...projects, { ...project, id: Date.now() }]);
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
      <div className="project-list">
        {projects.length === 0 ? (
          <p>No projects available. Click "Add Project" to create one.</p>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCards
                key={project.id}
                title={project.title}
                description={project.description}
                company={project.clientName}
                logo={project.image}
                onEdit={() => openModal(project)}
                onDelete={() =>
                  setProjects(projects.filter((p) => p.id !== project.id))
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
