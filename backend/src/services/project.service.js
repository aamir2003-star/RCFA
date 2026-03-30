import mongoose from "mongoose";
import { ProjectModel } from "../models/project/project.model.js";

// CREATE
export const createProject = async (data) => {
  return await ProjectModel.create(data);
};

// GET ALL with Pagination
export const getAllProjects = async (options = {}) => {
  const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    ProjectModel.find()
      .populate("createdBy", "name email role")
      .populate("projectManager", "name email")
      .populate("team", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    ProjectModel.countDocuments()
  ]);

  return {
    projects,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      hasNext: skip + projects.length < total
    }
  };
};

/**
 * Get project statistics using a single aggregation pipeline.
 * Counts requirements by status and conflicts by severity.
 */
import { RequirementModel } from "../models/requirements/requirement.model.js";
import { ConflictModel } from "../models/conflict/conflict.model.js";

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