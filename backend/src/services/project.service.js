import mongoose from "mongoose";
import { ProjectModel } from "../models/project/project.model.js";
import { RequirementModel } from "../models/requirements/requirement.model.js";
import { ConflictModel } from "../models/conflict/conflict.model.js";

// CREATE
export const createProject = async (data) => {
  return await ProjectModel.create(data);
};

// GET ALL with Pagination & Counts
export const getAllProjects = async (options = {}) => {
  const { page = 1, limit = 10, sort = { createdAt: -1 }, createdBy } = options;
  const skip = (page - 1) * limit;

  const query = createdBy ? { createdBy: new mongoose.Types.ObjectId(createdBy) } : {};

  const [projectsResult, total] = await Promise.all([
    ProjectModel.find(query)
      .populate("createdBy", "name email role")
      .populate("projectManager", "name email")
      .populate("team", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    ProjectModel.countDocuments(query)
  ]);

  // Append counts
  const projectsWithCounts = await Promise.all(projectsResult.map(async (project) => {
    const [reqCount, conCount] = await Promise.all([
      RequirementModel.countDocuments({ projectId: project._id }),
      ConflictModel.countDocuments({ projectId: project._id })
    ]);
    return { ...project, requirementCount: reqCount, conflictCount: conCount };
  }));

  return {
    projects: projectsWithCounts,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      hasNext: skip + projectsWithCounts.length < total
    }
  };
};

/**
 * Get project statistics using a single aggregation pipeline.
 * Counts requirements by status and conflicts by severity.
 */
export const getProjectStats = async (projectId) => {
  const stats = await Promise.all([
    RequirementModel.aggregate([
      { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    ConflictModel.aggregate([
      { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
      { $group: { _id: "$severityColor", count: { $sum: 1 } } }
    ])
  ]);

  // Format results with mapping
  const reqStats = stats[0].reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {
    approved: 0,
    draft: 0
  });

  const rawConflictStats = stats[1].reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});

  const conflictStats = {
    high: rawConflictStats.Red || 0,
    medium: (rawConflictStats.Orange || 0) + (rawConflictStats.Yellow || 0),
    low: rawConflictStats.Green || 0,
    total: Object.values(rawConflictStats).reduce((a, b) => a + b, 0)
  };

  return {
    requirements: {
      total: Object.values(reqStats).reduce((a, b) => a + b, 0),
      ...reqStats
    },
    conflicts: conflictStats
  };
};

/**
 * Get aggregated statistics for a BDE user.
 */
export const getBdeStats = async (userId) => {
  const bdeId = new mongoose.Types.ObjectId(userId);

  const stats = await Promise.all([
    // Total Projects
    ProjectModel.countDocuments({ createdBy: bdeId }),
    // Total Conflicts across BDE's projects
    ConflictModel.countDocuments({
      projectId: {
        $in: await ProjectModel.find({ createdBy: bdeId }).distinct("_id")
      }
    }),
    // Project status breakdown
    ProjectModel.aggregate([
      { $match: { createdBy: bdeId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ])
  ]);

  const [totalProjects, totalConflicts, statusBreakdown] = stats;

  const statusMap = statusBreakdown.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {
    planning: 0,
    active: 0,
    completed: 0
  });

  return {
    totalProjects,
    activeProjects: statusMap.active,
    totalConflicts,
    completedProjects: statusMap.completed,
    activeClients: totalProjects // Placeholder until Client model exists
  };
};

// GET BY ID
export const getProjectById = async (id) => {
  return await ProjectModel.findById(id)
    .populate("createdBy", "name email role")
    .populate("projectManager", "name email")
    .populate("team", "name email");
};

// UPDATE
export const updateProject = async (id, data) => {
  return await ProjectModel.findByIdAndUpdate(id, data, { new: true });
};

// DELETE
export const deleteProject = async (id) => {
  return await ProjectModel.findByIdAndDelete(id);
};