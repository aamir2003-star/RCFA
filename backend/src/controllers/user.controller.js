import User from '../models/user/user.model.js';
import { AppError } from '../utils/AppError.js';

export const getUsers = async (req, res, next) => {
    try {
        const { role } = req.query;
        const query = role ? { role } : {};

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
