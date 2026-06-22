import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('⚠️ Cloudinary environment variables are missing! Uploads will fail.');
} else {
    console.log('✅ Cloudinary initialized with:', {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: '***' + process.env.CLOUDINARY_API_KEY?.slice(-4)
    });
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Dynamic folder selection based on the request metadata or fieldname
        let folder = 'spectraAI/others';

        if (file.fieldname === 'avatar') {
            folder = 'spectraAI/avatar';
        } else if (file.fieldname === 'cover' || file.fieldname === 'coverImage') {
            folder = 'spectraAI/covers';
        } else if (file.fieldname === 'chat' || file.fieldname === 'attachments') {
            if (file.mimetype.startsWith('image/')) {
                folder = 'spectraAI/discussion/images';
            } else if (file.mimetype.startsWith('video/')) {
                folder = 'spectraAI/discussion/video';
            } else {
                folder = 'spectraAI/discussion/others';
            }
        } else if (file.mimetype.startsWith('image/')) {
            // Fallback for general images if not otherwise specified
            folder = 'spectraAI/images';
        }

        console.log(`📁 Target folder determined: ${folder} for file: ${file.originalname}`);

        return {
            folder: folder,
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
            resource_type: 'auto',
        };
    },
});

export { cloudinary, storage };
