import multer from 'multer';
import { storage } from '../config/cloudinary.js';

// Image only filter for avatars
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

// General filter for chat (images + documents)
const chatFilter = (req, file, cb) => {
    const allowedTypes = ['image/', 'application/pdf', 'text/csv', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.some(type => file.mimetype.startsWith(type))) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type!'), false);
    }
};

export const uploadAvatar = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});

export const uploadConflict = multer({
    storage: storage,
    fileFilter: chatFilter,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10MB limit
    }
});

export const uploadOthers = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20 // 20MB limit
    }
});
