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

export const getAllRequirements = async (query = {}, options = {}) => {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const [requirements, total] = await Promise.all([
        RequirementModel.find(query)
            .populate("createdBy", "name email role")
            .sort(sort)
            .skip(skip)
            .limit(limit),
        RequirementModel.countDocuments(query)
    ]);

    return {
        requirements,
        pagination: {
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            hasNext: skip + requirements.length < total
        }
    };
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
