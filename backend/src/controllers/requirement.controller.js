import * as requirementService from "../services/requirement.service.js";
import { parseRequirementsCSV } from "../services/csv.service.js";
import fs from 'fs';

export const createRequirement = async (req, res, next) => {
    try {
        const requirement = await requirementService.createRequirement({
            ...req.body,
            createdBy: req.user?._id // Assumes auth middleware
        });
        res.status(201).json(requirement);
    } catch (error) {
        next(error);
    }
};

export const getRequirements = async (req, res, next) => {
    try {
        const { projectId, page, limit, sort } = req.query;
        const filter = projectId ? { projectId } : {};
        const result = await requirementService.getAllRequirements(filter, { page, limit, sort });
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getRequirementById = async (req, res, next) => {
    try {
        const requirement = await requirementService.getRequirementById(req.params.id);
        if (!requirement) {
            return res.status(404).json({ message: "Requirement not found" });
        }
        res.json(requirement);
    } catch (error) {
        next(error);
    }
};

export const updateRequirement = async (req, res, next) => {
    try {
        const requirement = await requirementService.updateRequirement(req.params.id, {
            ...req.body,
            updatedBy: req.user?._id
        });
        if (!requirement) {
            return res.status(404).json({ message: "Requirement not found" });
        }
        res.json(requirement);
    } catch (error) {
        next(error);
    }
};

export const deleteRequirement = async (req, res, next) => {
    try {
        const requirement = await requirementService.deleteRequirement(req.params.id);
        if (!requirement) {
            return res.status(404).json({ message: "Requirement not found" });
        }
        res.json({ message: "Requirement deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const uploadRequirements = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No CSV file uploaded" });
        }

        const { projectId } = req.body;
        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const requirements = await parseRequirementsCSV(req.file.path);
        const docs = await requirementService.bulkCreateRequirements(
            requirements,
            projectId,
            req.user?._id
        );

        res.status(201).json({
            message: `Successfully imported ${docs.length} requirements`,
            count: docs.length,
            requirements: docs,
            filePath: req.file.path // Return path for reference
        });
    } catch (error) {
        next(error);
    }
};

export const generateRequirements = async (req, res, next) => {
    try {
        const { projectId, teams } = req.body;
        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const requirements = await requirementService.generateAiRequirements(
            projectId,
            teams || ['Developer', 'Legal'],
            req.user?._id
        );

        res.status(201).json({
            message: `Successfully generated ${requirements.length} AI requirements for review`,
            count: requirements.length,
            requirements
        });
    } catch (error) {
        next(error);
    }
};

