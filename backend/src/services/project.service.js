import { ProjectModel } from "../models/project/project.model.js";

// CREATE
export const createProject = async (data) => {
  return await ProjectModel.create(data);
};

// GET ALL
export const getAllProjects = async () => {
  return await ProjectModel.find()
    .populate("createdBy", "name email role")
    .populate("projectManager", "name email")
    .populate("team", "name email");
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