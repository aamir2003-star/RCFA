import { RequirementModel } from "../models/requirements/requirement.model.js";
import { ActivityModel } from "../models/activity/activity.model.js";

export const createRequirement = async (data) => {
    const requirement = await RequirementModel.create(data);

    // Log activity
    await ActivityModel.create({
        projectId: data.projectId,
        action: `Created requirement: ${data.title}`,
        performedBy: data.createdBy
    });

    return requirement;
};

export const getAllRequirements = async (query = {}) => {
    return await RequirementModel.find(query).populate("createdBy", "name email role");
};

export const getRequirementById = async (id) => {
    return await RequirementModel.findById(id).populate("createdBy moduleId");
};

export const updateRequirement = async (id, data) => {
    const requirement = await RequirementModel.findByIdAndUpdate(id, data, { new: true });

    if (requirement && data.projectId) {
        await ActivityModel.create({
            projectId: requirement.projectId,
            action: `Updated requirement: ${requirement.title}`,
            performedBy: data.updatedBy || requirement.createdBy
        });
    }

    return requirement;
};

export const deleteRequirement = async (id) => {
    const requirement = await RequirementModel.findByIdAndDelete(id);

    if (requirement) {
        await ActivityModel.create({
            projectId: requirement.projectId,
            action: `Deleted requirement: ${requirement.title}`,
            performedBy: requirement.createdBy // Simplified for now
        });
    }

    return requirement;
};
