import * as projectService from "../services/project.service.js";
import { RequirementModel } from "../models/requirements/requirement.model.js";
import { ConflictModel } from "../models/conflict/conflict.model.js";
import { ProjectModel } from "../models/project/project.model.js";

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
    const { page, limit, sort, createdBy, projectManager } = req.query;
    // Auto-filter by user role
    let filter = {};
    if (req.user?.role === 'BDE') {
      filter.createdBy = req.user._id;
    } else if (req.user?.role === 'PM') {
      filter.projectManager = req.user._id;
    } else {
      // Admin or other: allow query params
      if (createdBy) filter.createdBy = createdBy;
      if (projectManager) filter.projectManager = projectManager;
    }

    const projects = await projectService.getAllProjects({
      page,
      limit,
      sort,
      ...filter
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PROJECT STATS
export const getProjectStats = async (req, res) => {
  try {
    const { timeframe } = req.query;
    const stats = await projectService.getProjectStats(req.params.id, timeframe);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BDE DASHBOARD STATS
export const getBdeStats = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const stats = await projectService.getBdeStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PM DASHBOARD STATS
export const getPmStats = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const stats = await projectService.getPmStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/v1/projects/pm/activity
 * Returns a unified activity timeline of recent requirements and conflicts
 * across all of the authenticated PM's projects.
 */
export const getPmActivity = async (req, res) => {
  try {
    const pmId = req.user?._id;
    if (!pmId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const pmProjectIds = await ProjectModel.find({ projectManager: pmId }).distinct("_id");

    const timeframe = req.query.timeframe || 'all';
    let dateFilter = { projectId: { $in: pmProjectIds } };
    let limit = 15; // default for 'recent'

    if (timeframe !== 'all') {
      const now = new Date();
      let startDate = new Date();
      let endDate = null;

      if (timeframe === 'today') {
        startDate.setHours(0, 0, 0, 0);
        limit = 30;
      } else if (timeframe === 'yesterday') {
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        limit = 30;
      } else if (timeframe === 'week') {
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        limit = 100;
      } else if (timeframe === 'month') {
        startDate.setMonth(now.getMonth() - 1);
        startDate.setHours(0, 0, 0, 0);
        limit = 200;
      }

      dateFilter.createdAt = { $gte: startDate };
      if (endDate) dateFilter.createdAt.$lte = endDate;
    }

    // Fetch recent requirements and conflicts in parallel
    const [recentRequirements, recentConflicts] = await Promise.all([
      RequirementModel.find(dateFilter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('projectId', 'name')
        .lean(),
      ConflictModel.find(dateFilter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('requirementA', 'title')
        .populate('requirementB', 'title')
        .populate('projectId', 'name')
        .lean()
    ]);

    // Build unified activity feed
    const activities = [];

    recentRequirements.forEach(req => {
      activities.push({
        id: req._id,
        type: 'requirement',
        action: req.status === 'approved' ? 'approved' : 'created',
        title: req.title || 'Untitled Requirement',
        projectName: req.projectId?.name || 'Unknown Project',
        status: req.status,
        priority: req.priority,
        timestamp: req.createdAt
      });
    });

    recentConflicts.forEach(conflict => {
      // Add the conflict detection/open entry
      activities.push({
        id: conflict._id,
        type: 'conflict',
        action: conflict.status === 'resolved' ? 'resolved' : 'detected',
        title: conflict.explanation || 'Requirement Conflict',
        projectName: conflict.projectId?.name || 'Unknown Project',
        reqA: conflict.requirementA?.title,
        reqB: conflict.requirementB?.title,
        severity: conflict.severityColor,
        severityScore: conflict.severityScore,
        status: conflict.status,
        timestamp: conflict.createdAt
      });

      // If resolved, add a dedicated resolution entry with details
      if (conflict.status === 'resolved' && conflict.pmResolution?.resolutionId) {
        const resolution = (conflict.resolutions || []).find(
          r => r._id?.toString() === conflict.pmResolution.resolutionId
        );

        if (resolution) {
          activities.push({
            id: `${conflict._id}_res`,
            type: 'resolution',
            action: 'settled',
            title: `Resolution: ${resolution.title}`,
            description: resolution.description,
            strategyType: resolution.strategyType,
            projectName: conflict.projectId?.name || 'Unknown Project',
            reqA: conflict.requirementA?.title,
            reqB: conflict.requirementB?.title,
            timestamp: conflict.pmResolution.confirmedAt || conflict.updatedAt,
            confirmedBy: conflict.pmResolution.confirmedBy
          });
        }
      }
    });

    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      total: activities.length,
      activities: activities.slice(0, 20)
    });
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