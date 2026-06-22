import User from '../models/user/user.model.js';
import { ProjectModel } from '../models/project/project.model.js';
import { AppError } from '../utils/AppError.js';

export const getUsers = async (req, res, next) => {
    try {
        const { role } = req.query;
        const query = role ? { role: { $regex: new RegExp(`^${role}$`, 'i') } } : {};

        const users = await User.find(query)
            .select('name email role isOnline')
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

        // Fetch all developers (case-insensitive role check)
        const allDevs = await User.find({
            role: { $regex: /^dev$/i }
        }).select('name email role avatar isOnline').lean();

        // Fetch ALL projects to calculate global workload
        const allProjects = await ProjectModel.find({})
            .select('name team projectManager')
            .lean();

        // Map devs to their project assignments
        const memberMap = new Map();

        // Initialize map with all developers
        allDevs.forEach(user => {
            memberMap.set(user._id.toString(), {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: 'Developer',
                avatar: user.avatar || null,
                projectCount: 0,
                projects: []
            });
        });

        // Calculate workload across all projects
        allProjects.forEach(project => {
            (project.team || []).forEach(memberId => {
                const id = memberId.toString();
                if (memberMap.has(id)) {
                    const entry = memberMap.get(id);
                    entry.projectCount += 1;
                    entry.projects.push(project.name);
                }
            });
        });

        const devs = Array.from(memberMap.values());

        // Calculate Specialized Stats
        const totalDevs = devs.length;
        const availableDevs = devs.filter(d => d.projectCount === 0).length;
        const inProductionCount = devs.filter(d => d.projectCount > 0 && d.projectCount <= 2).length;
        const highLoadDevs = devs.filter(d => d.projectCount > 2).length;
        const totalProjectsCount = devs.reduce((sum, d) => sum + d.projectCount, 0);
        const averageWorkload = totalDevs > 0 ? (totalProjectsCount / totalDevs).toFixed(1) : 0;

        res.json({
            success: true,
            stats: {
                totalDevs,
                availableDevs,
                inProductionCount,
                highLoadDevs,
                averageWorkload
            },
            members: devs
        });
    } catch (err) {
        next(new AppError(err.message, 500));
    }
};
