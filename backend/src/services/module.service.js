import { ModuleModel } from "../models/module/module.model.js";
import { ProjectModel } from "../models/project/project.model.js";
import User from "../models/user/user.model.js";
import { callGeminiJSON } from "../utils/geminiHelper.js";

/**
 * Create a new module
 */
export const createModule = async (moduleData) => {
  const moduleDoc = await ModuleModel.create(moduleData);
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
  return moduleDoc;
};

/**
 * Get developers available for a project
 */
export const getProjectDevelopers = async (projectId) => {
  const project = await ProjectModel.findById(projectId).populate("team", "name email role");
  if (!project) {
    throw new Error("Project not found");
  }

  // Filter only users with role that matches Developer (case insensitive or specific constant)
  // Usually 'DEV' or 'Developer'
  return project.team.filter(user => user.role === 'DEV' || user.role === 'Developer');
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
 * Automatically assign the developer suggested by AI
 */
export const assignSuggestedDeveloper = async (moduleId) => {
  const suggestion = await getAssignmentSuggestions(moduleId);

  if (suggestion && suggestion.suggestedDeveloperId && suggestion.confidence > 0.5) {
    return await assignDeveloperToModule(moduleId, suggestion.suggestedDeveloperId);
  }

  throw new Error(suggestion?.reasoning || "AI could not provide a confident suggestion.");
};
