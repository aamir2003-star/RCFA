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
  const { page = 1, limit = 10, sort = { createdAt: -1 }, createdBy, projectManager } = options;
  const skip = (page - 1) * limit;

  let query = {};
  if (createdBy) query.createdBy = new mongoose.Types.ObjectId(createdBy);
  if (projectManager) query.projectManager = new mongoose.Types.ObjectId(projectManager);

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
export const getProjectStats = async (projectId, timeframe = 'WEEKLY') => {
  const pId = new mongoose.Types.ObjectId(projectId);

  // Set time window and aggregation format based on timeframe
  const now = new Date();
  let startDate = new Date();
  let dateFormat = "%Y-%m-%d"; // Default for WEEKLY and MONTHLY

  switch (timeframe.toUpperCase()) {
    case 'DAILY':
      startDate.setHours(now.getHours() - 24);
      dateFormat = "%Y-%m-%d %H:00"; // Hourly granularity
      break;
    case 'MONTHLY':
      startDate.setDate(now.getDate() - 30);
      dateFormat = "%Y-%m-%d";
      break;
    case 'WEEKLY':
    default:
      startDate.setDate(now.getDate() - 7);
      dateFormat = "%Y-%m-%d";
      break;
  }

  const [reqStatsRaw, conflictStatsRaw, timelineData, recentActivity] = await Promise.all([
    // Requirement breakdown
    RequirementModel.aggregate([
      { $match: { projectId: pId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    // Conflict severity breakdown
    ConflictModel.aggregate([
      { $match: { projectId: pId } },
      { $group: { _id: "$severityColor", count: { $sum: 1 } } }
    ]),
    // Timeline: conflicts in the selected timeframe
    ConflictModel.aggregate([
      {
        $match: {
          projectId: pId,
          createdAt: { $gt: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]),
    // Recent activity (last 5 conflicts)
    ConflictModel.find({ projectId: pId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("requirementA", "title")
      .lean()
  ]);

  // Process Requirement Stats
  const reqStats = reqStatsRaw.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {
    approved: 0,
    draft: 0,
    review: 0
  });
  const totalReqs = Object.values(reqStats).reduce((a, b) => a + b, 0);

  // Process Conflict Stats
  const rawConflictStats = conflictStatsRaw.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});
  const totalConflicts = Object.values(rawConflictStats).reduce((a, b) => a + b, 0);

  // Logical Readiness Score: (Approved Reqs / Total Reqs) - (Total Conflicts * 0.05 weighting)
  // Base 100%, subtract for drafts and conflicts.
  const approvedRatio = totalReqs > 0 ? (reqStats.approved / totalReqs) : 0;
  const conflictPenalty = Math.min(totalConflicts * 0.02, 0.5); // Max 50% penalty
  const readinessValue = Math.max(Math.round((approvedRatio - conflictPenalty) * 100), 0);

  return {
    requirements: {
      total: totalReqs,
      ...reqStats,
      clarity: totalReqs > 0 ? Math.round((reqStats.approved / totalReqs) * 100) : 0
    },
    conflicts: {
      total: totalConflicts,
      high: rawConflictStats.Red || 0,
      medium: (rawConflictStats.Orange || 0) + (rawConflictStats.Yellow || 0),
      low: rawConflictStats.Green || 0,
    },
    readiness: readinessValue,
    timeline: timelineData,
    activity: recentActivity.map(c => ({
      id: c._id,
      title: c.requirementA?.title || "Unknown Requirement",
      type: c.conflictType || "Unknown",
      status: c.status,
      severity: c.severityColor,
      time: c.updatedAt
    }))
  };
};

/**
 * Get aggregated statistics for a PM user.
 */
export const getPmStats = async (userId) => {
  try {
    const pmId = new mongoose.Types.ObjectId(userId);

    // Get all project IDs once to reuse
    const pmProjectIds = await ProjectModel.find({ projectManager: pmId }).distinct("_id");

    const stats = await Promise.all([
      // Total Projects
      ProjectModel.countDocuments({ projectManager: pmId }),

      // Total Conflicts across PM's projects
      ConflictModel.countDocuments({
        projectId: { $in: pmProjectIds }
      }),

      // Total Requirements
      RequirementModel.countDocuments({
        projectId: { $in: pmProjectIds }
      }),

      // Status breakdown
      ProjectModel.aggregate([
        { $match: { projectManager: pmId } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),

      // Unique team members across all PM projects
      ProjectModel.aggregate([
        { $match: { projectManager: pmId } },
        { $unwind: { path: "$team", preserveNullAndEmptyArrays: false } },
        { $group: { _id: null, uniqueMembers: { $addToSet: "$team" } } },
        { $project: { count: { $size: "$uniqueMembers" } } }
      ])
    ]);

    const [totalProjects, totalConflicts, totalRequirements, statusBreakdown, teamAgg] = stats;

    const statusMap = statusBreakdown.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {
      planning: 0,
      active: 0,
      completed: 0
    });

    const teamCount = teamAgg.length > 0 ? teamAgg[0].count : 0;

    return {
      totalProjects,
      activeProjects: statusMap.active,
      totalConflicts,
      totalRequirements,
      completedProjects: statusMap.completed,
      teamCount
    };
  } catch (error) {
    console.error("Error in getPmStats service:", error);
    throw error;
  }
};

/**
 * Get aggregated statistics for a BDE user.
 */
export const getBdeStats = async (userId) => {
  try {
    const bdeId = new mongoose.Types.ObjectId(userId);

    // Get all project IDs once to reuse in multiple counts
    const bdeProjectIds = await ProjectModel.find({ createdBy: bdeId }).distinct("_id");

    const stats = await Promise.all([
      // Total Projects
      ProjectModel.countDocuments({ createdBy: bdeId }),

      // Total Conflicts across BDE's projects
      ConflictModel.countDocuments({
        projectId: { $in: bdeProjectIds }
      }),

      // Project status breakdown
      ProjectModel.aggregate([
        { $match: { createdBy: bdeId } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),

      // Unique Clients count
      ProjectModel.distinct("clientName", { createdBy: bdeId }),

      // Cumulative Requirements count
      RequirementModel.countDocuments({
        projectId: { $in: bdeProjectIds }
      })
    ]);

    const [totalProjects, totalConflicts, statusBreakdown, uniqueClients, totalRequirements] = stats;

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
      activeClients: uniqueClients.length,
      totalRequirements
    };
  } catch (error) {
    console.error("Error in getBdeStats service:", error);
    throw error;
  }
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