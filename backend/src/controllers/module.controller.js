import * as moduleService from "../services/module.service.js";

export const createModule = async (req, res, next) => {
  try {
    const moduleDoc = await moduleService.createModule(req.body);
    res.status(201).json(moduleDoc);
  } catch (error) {
    next(error);
  }
};

export const getAllModules = async (req, res, next) => {
  try {
    const modules = await moduleService.getAllModules(req.query);
    res.json(modules);
  } catch (error) {
    next(error);
  }
};

export const getModuleById = async (req, res, next) => {
  try {
    const moduleDoc = await moduleService.getModuleById(req.params.id);
    res.json(moduleDoc);
  } catch (error) {
    next(error);
  }
};

export const updateModule = async (req, res, next) => {
  try {
    const moduleDoc = await moduleService.updateModule(req.params.id, req.body);
    res.json(moduleDoc);
  } catch (error) {
    next(error);
  }
};

export const deleteModule = async (req, res, next) => {
  try {
    await moduleService.deleteModule(req.params.id);
    res.json({ message: "Module deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const assignDeveloper = async (req, res, next) => {
  try {
    const moduleDoc = await moduleService.assignDeveloperToModule(
      req.params.id,
      req.body.developerId
    );
    res.json(moduleDoc);
  } catch (error) {
    next(error);
  }
};

export const getAssignmentSuggestions = async (req, res, next) => {
  try {
    const suggestions = await moduleService.getAssignmentSuggestions(
      req.params.id
    );
    res.json(suggestions);
  } catch (error) {
    next(error);
  }
};

export const assignSuggestedDeveloper = async (req, res, next) => {
  try {
    const result = await moduleService.assignSuggestedDeveloper(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getProjectDevelopers = async (req, res, next) => {
  try {
    const developers = await moduleService.getProjectDevelopers(
      req.params.projectId
    );
    res.json(developers);
  } catch (error) {
    next(error);
  }
};

export const suggestModuleInfo = async (req, res, next) => {
  try {
    const { requirementIds } = req.body;
    const suggestion = await moduleService.generateModuleInfo(requirementIds);
    res.json(suggestion);
  } catch (error) {
    next(error);
  }
};

export const updateModuleStatus = async (req, res, next) => {
  try {
    const moduleDoc = await moduleService.updateModuleStatus(
      req.params.id,
      req.body.status
    );
    res.json(moduleDoc);
  } catch (error) {
    next(error);
  }
};
