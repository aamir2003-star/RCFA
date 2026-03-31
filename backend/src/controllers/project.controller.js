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
    const { page, limit, sort, createdBy } = req.query;
    // Auto-filter by user if BDE, or allow override if admin
    const filterBy = req.user?.role === 'BDE' ? req.user._id : createdBy;

    const projects = await projectService.getAllProjects({
      page,
      limit,
      sort,
      createdBy: filterBy
    });
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

// GET BDE DASHBOARD STATS
export const getBdeStats = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId; // Prefer req.user from auth middleware
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const stats = await projectService.getBdeStats(userId);
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