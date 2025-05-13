import { config } from 'dotenv';

config({ path: '.env' });

export const {
    PORT,
    MONGODB_URI,
    NODE_ENV,
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} = process.env;