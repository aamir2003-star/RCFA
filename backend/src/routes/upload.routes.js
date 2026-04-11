import express from 'express';
import { uploadAvatar, uploadConflict } from '../utils/upload.utils.js';
import { authenticate } from '../middleware/authenticate.js';
import User from '../models/user/user.model.js';
import { AppError } from '../utils/AppError.js';

const router = express.Router();

// ─── Profile Avatar Upload ───────────────────────────────────────────────
router.post('/avatar', authenticate, uploadAvatar.single('avatar'), async (req, res, next) => {
    try {
        console.log('📬 Avatar upload request received');
        console.log('👤 User:', req.user?._id, req.user?.email);
        console.log('📄 File:', req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            path: req.file.path,
            filename: req.file.filename
        } : 'No file');

        if (!req.file) {
            return next(new AppError('No file uploaded', 400));
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Store Cloudinary metadata
        user.avatar = {
            url: req.file.path, // Cloudinary URL
            public_id: req.file.filename // Cloudinary public_id
        };

        await user.save();

        console.log('✅ Avatar uploaded and saved for user:', user.email, user.avatar.url);

        const safeUser = user.toObject();
        delete safeUser.password;
        safeUser.id = user._id.toString();

        res.json({
            success: true,
            message: 'Avatar uploaded successfully',
            user: safeUser
        });
    } catch (err) {
        console.error('❌ Avatar upload error:', err);
        next(new AppError(err.message, 500));
    }
});

// ─── Profile Cover Upload ───────────────────────────────────────────────
router.post('/cover', authenticate, uploadAvatar.single('cover'), async (req, res, next) => {
    try {
        console.log('📬 Cover upload request received');
        if (!req.file) {
            return next(new AppError('No file uploaded', 400));
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        user.coverImage = {
            url: req.file.path,
            public_id: req.file.filename
        };

        await user.save();

        const safeUser = user.toObject();
        delete safeUser.password;
        safeUser.id = user._id.toString();

        res.json({
            success: true,
            message: 'Cover image updated successfully',
            user: safeUser
        });
    } catch (err) {
        console.error('❌ Cover upload error:', err);
        next(new AppError(err.message, 500));
    }
});

// ─── Generic Chat/Attachment Upload ──────────────────────────────────────
router.post('/chat', authenticate, uploadConflict.array('attachments', 5), async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return next(new AppError('No files uploaded', 400));
        }

        const attachments = req.files.map(file => ({
            url: file.path,
            public_id: file.filename
        }));

        res.json({
            success: true,
            attachments: attachments
        });
    } catch (err) {
        next(new AppError(err.message, 500));
    }
});

export default router;
