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

        // Fetch all users with relevant roles
        const allUsers = await User.find({
            role: { $in: ['Dev', 'PM', 'BDE'] }
        }).select('name email role avatar').lean();

        // Fetch ALL projects to calculate global workload
        const allProjects = await ProjectModel.find({})
            .select('name team projectManager')
            .lean();

        // Map users to their project assignments
        const memberMap = new Map();

        // Initialize map with all users
        allUsers.forEach(user => {
            memberMap.set(user._id.toString(), {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar || null,
                projectCount: 0,
                projects: []
            });
        });

        // Calculate workload across all projects
        allProjects.forEach(project => {
            // Check team members
            (project.team || []).forEach(memberId => {
                const id = memberId.toString();
                if (memberMap.has(id)) {
                    const entry = memberMap.get(id);
                    entry.projectCount += 1;
                    entry.projects.push(project.name);
                }
            });

            // Check PM
            if (project.projectManager) {
                const pmIdStr = project.projectManager.toString();
                if (memberMap.has(pmIdStr)) {
                    const entry = memberMap.get(pmIdStr);
                    entry.projectCount += 1;
                    entry.projects.push(project.name);
                }
            }
        });

        const teamMembers = Array.from(memberMap.values());
        const pmProjectCount = allProjects.filter(p => p.projectManager?.toString() === pmId.toString()).length;

        res.json({
            success: true,
            totalMembers: teamMembers.length,
            totalProjects: pmProjectCount, // Keeping this as the PM's managed projects count for the header
            members: teamMembers
        });
    } catch (err) {
        next(new AppError(err.message, 500));
    }
};
