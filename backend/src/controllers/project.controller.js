import * as projectService from "../services/project.service.js";

// CREATE
export const createProject = async (req, res) => {
  try {
    const { name, createdBy, projectManager } = req.body;

    if (!name || !createdBy || !projectManager) {
      return res.status(400).json({
        message: "name, createdBy and projectManager are required",
      });
    }

    const project = await projectService.createProject(req.body);

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL with Pagination
export const getAllProjects = async (req, res) => {
  try {
    const { page, limit, sort } = req.query;
    const projects = await projectService.getAllProjects({ page, limit, sort });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PROJECT STATS
export const getProjectStats = async (req, res) => {
  try {
    const stats = await projectService.getProjectStats(req.params.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY ID
export const getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateProject = async (req, res) => {
  try {
    const project = await projectService.updateProject(
      req.params.id,
      req.body
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteProject = async (req, res) => {
  try {
    const project = await projectService.deleteProject(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};