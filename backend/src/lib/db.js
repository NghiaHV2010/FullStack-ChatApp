import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/env.config.js';

export const connectDB = async () => {
    try {
        const connectionDB = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB connected: ${connectionDB.connection.host}`);

    } catch (error) {
        console.error(error);
    }
}