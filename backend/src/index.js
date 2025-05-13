import express from 'express'
import authRoutes from './routes/auth.routes.js';
import { NODE_ENV, PORT } from './config/env.config.js';
import { connectDB } from './lib/db.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/message.routes.js';
import cors from "cors";
import { app, server } from './lib/socket.js';
import path from 'path';

const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.use(errorMiddleware);

if (NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
    connectDB();
})