import User from '../models/user/user.model.js';
import { ProjectModel } from '../models/project/project.model.js';
import { AppError } from '../utils/AppError.js';

export const getUsers = async (req, res, next) => {
    try {
        const { role } = req.query;
        const query = role ? { role: { $regex: new RegExp(`^${role}$`, 'i') } } : {};

        const users = await User.find(query)
            .select('name email role')
            .sort({ name: 1 });

        res.json(users);
    } catch (err) {
        next(new AppError(err.message, 500));
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return next(new AppError('User not found', 404));
        }
        res.json(user);
    } catch (err) {
        next(new AppError(err.message, 500));
    }
};

/**
 * GET /api/v1/users/team
 * Returns all unique team members across the authenticated PM's projects,
 * with project assignment count as a workload indicator.
 */
export const getPmTeam = async (req, res, next) => {
    try {
        const pmId = req.user._id;

        // Find all projects managed by this PM, populate team members
        const pmProjects = await ProjectModel.find({ projectManager: pmId })
            .select('name team')
            .populate('team', 'name email role avatar')
            .lean();

        // Build a map of unique members with their project assignments
        const memberMap = new Map();

        pmProjects.forEach(project => {
            (project.team || []).forEach(member => {
                const id = member._id.toString();
                if (memberMap.has(id)) {
                    const existing = memberMap.get(id);
                    existing.projectCount += 1;
                    existing.projects.push(project.name);
                } else {
                    memberMap.set(id, {
                        _id: member._id,
                        name: member.name,
                        email: member.email,
                        role: member.role,
                        avatar: member.avatar || null,
                        projectCount: 1,
                        projects: [project.name]
                    });
                }
            });
        });

        const teamMembers = Array.from(memberMap.values());

        res.json({
            success: true,
            totalMembers: teamMembers.length,
            totalProjects: pmProjects.length,
            members: teamMembers
        });
    } catch (err) {
        next(new AppError(err.message, 500));
    }
};
