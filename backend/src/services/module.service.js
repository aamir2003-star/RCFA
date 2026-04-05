import mongoose from "mongoose";
import { ModuleModel } from "../models/module/module.model.js";
import { ProjectModel } from "../models/project/project.model.js";
import User from "../models/user/user.model.js";
import { callGeminiJSON } from "../utils/geminiHelper.js";
import { createNotification } from "./notification.service.js";

/**
 * Create a new module
 */
export const createModule = async (moduleData) => {
  const moduleDoc = await ModuleModel.create(moduleData);

  // Link requirements to the new module
  if (moduleData.requirements && moduleData.requirements.length > 0) {
    const { RequirementModel } = await import("../models/requirements/requirement.model.js");
    await RequirementModel.updateMany(
      { _id: { $in: moduleData.requirements } },
      { $set: { moduleId: moduleDoc._id } }
    );
  }

  // If a developer is assigned, ensure they are in the project team
  if (moduleData.assignedTo && moduleData.projectId) {
    await ProjectModel.findByIdAndUpdate(
      moduleData.projectId,
      { $addToSet: { team: moduleData.assignedTo } }
    );
  }

  return moduleDoc;
};

/**
 * Get all modules with optional filters
 */
export const getAllModules = async (filters = {}) => {
  const modules = await ModuleModel.find(filters)
    .populate("assignedTo", "name email role")
    .populate("requirements", "title priority category");
  return modules;
};

/**
 * Get module by ID
 */
export const getModuleById = async (id) => {
  const moduleDoc = await ModuleModel.findById(id)
    .populate("assignedTo", "name email role")
    .populate("requirements", "title priority category");

  if (!moduleDoc) {
    throw new Error("Module not found");
  }
  return moduleDoc;
};

/**
 * Update module
 */
export const updateModule = async (id, updateData) => {
  const moduleDoc = await ModuleModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!moduleDoc) {
    throw new Error("Module not found");
  }
  return moduleDoc;
};

/**
 * Delete module
 */
export const deleteModule = async (id) => {
  // Unlink requirements before deleting the module
  const { RequirementModel } = await import("../models/requirements/requirement.model.js");
  await RequirementModel.updateMany(
    { moduleId: new mongoose.Types.ObjectId(id) },
    { $set: { moduleId: null } }
  );

  const moduleDoc = await ModuleModel.findByIdAndDelete(id);
  if (!moduleDoc) {
    throw new Error("Module not found");
  }
  return moduleDoc;
};

/**
 * Assign a developer to a module
 */
export const assignDeveloperToModule = async (moduleId, developerId) => {
  const moduleDoc = await ModuleModel.findByIdAndUpdate(
    moduleId,
    { assignedTo: developerId, status: "in-progress" },
    { new: true }
  ).populate("assignedTo", "name email role");

  if (!moduleDoc) {
    throw new Error("Module not found");
  }

  // Ensure developer is in the project team
  await ProjectModel.findByIdAndUpdate(
    moduleDoc.projectId,
    { $addToSet: { team: developerId } }
  );

  // Notify the developer
  await createNotification({
    recipient: developerId,
    title: "New Module Assigned",
    message: `You have been assigned as the lead for module: ${moduleDoc.name}`,
    type: "info",
    link: `/dev/modules`
  });

  return moduleDoc;
};

/**
 * Get developers available for a project
 */
export const getProjectDevelopers = async (projectId) => {
  const project = await ProjectModel.findById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  // Show all developers in the system so PM can assign any of them
  const developers = await User.find({
    role: { $regex: /^(DEV|Developer)$/i }
  }).select('name email role avatar').lean();

  return developers;
};

/**
 * AI-powered assignment suggestions
 * Analyzes module requirements and developer profiles/roles to suggest the best fit.
 */
export const getAssignmentSuggestions = async (moduleId) => {
  const moduleDoc = await ModuleModel.findById(moduleId).populate("requirements");
  if (!moduleDoc) {
    throw new Error("Module not found");
  }

  const developers = await getProjectDevelopers(moduleDoc.projectId);
  if (developers.length === 0) {
    return { suggestions: [], reason: "No developers found in this project." };
  }

  const requirementsText = moduleDoc.requirements
    .map(r => `- ${r.title}: ${r.description}`)
    .join("\n");

  const developersText = developers
    .map(d => `- ID: ${d._id}, Name: ${d.name}, Role: ${d.role}`)
    .join("\n");

  const prompt = `
    You are a project management assistant. Based on the following module requirements and available developers, suggest the best developer for assignment.
    
    Module: ${moduleDoc.name}
    Requirements:
    ${requirementsText}
    
    Available Developers:
    ${developersText}
    
    Analyze the requirements and developers. Return a JSON object with:
    - suggestedDeveloperId: The ID string of the best developer.
    - confidence: A score from 0 to 1.
    - reasoning: A brief explanation why this developer is the best fit.
  `.trim();

  const aiResult = await callGeminiJSON(prompt, "You are an expert project management assistant.");
  return aiResult;
};

/**
 * AI-powered module information suggestion
 * Analyzes selected requirements to suggest a module name and focus area.
 */
export const generateModuleInfo = async (requirementIds) => {
  if (!requirementIds || requirementIds.length === 0) {
    throw new Error("No requirements selected for suggestion.");
  }

  // Fetch requirements to get their titles and descriptions
  // We need to import RequirementModel or use a service, but since we are in module.service,
  // we might need to import RequirementModel here if not already available.
  const { RequirementModel } = await import("../models/requirements/requirement.model.js");
  const requirements = await RequirementModel.find({ _id: { $in: requirementIds } });

  const requirementsText = requirements
    .map(r => `- ${r.title}: ${r.description}`)
    .join("\n");

  const prompt = `
    You are a technical architect assistant. Based on the following project requirements, suggest a concise and professional Module Name and a brief "Focus Area/Context" summary (max 2 sentences) for a software module that would encompass these requirements.
    
    Requirements:
    ${requirementsText}
    
    Return a JSON object with:
    - name: A professional module name (e.g., "User Authentication", "Payment Gateway", "Data Analytics Engine").
    - description: A brief summary of the module's focus and purpose.
  `.trim();

  const aiResult = await callGeminiJSON(prompt, "You are an expert technical architect.");
  return aiResult;
};

/**
 * Automatically assign the developer suggested by AI
 */
export const assignSuggestedDeveloper = async (moduleId) => {
  const suggestion = await getAssignmentSuggestions(moduleId);

  if (suggestion && suggestion.suggestedDeveloperId && suggestion.confidence > 0.5) {
    return await assignDeveloperToModule(moduleId, suggestion.suggestedDeveloperId);
  }

  throw new Error(suggestion?.reasoning || "AI could not provide a confident suggestion.");
};

/**
 * Update module status (Pending, In Progress, Completed)
 */
export const updateModuleStatus = async (moduleId, status) => {
  const validStatuses = ["pending", "in-progress", "completed"];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}. Must be one of ${validStatuses.join(", ")}`);
  }

  const moduleDoc = await ModuleModel.findByIdAndUpdate(
    moduleId,
    { status },
    { new: true, runValidators: true }
  ).populate("assignedTo", "name email role");

  if (!moduleDoc) {
    throw new Error("Module not found");
  }
  return moduleDoc;
};
