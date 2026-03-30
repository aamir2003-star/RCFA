import * as requirementService from "../services/requirement.service.js";

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
