import { Router } from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);

authRoutes.post("/logout", logout);

authRoutes.put("/update-profile", authMiddleware, updateProfile);

authRoutes.get("/check", authMiddleware, checkAuth);

export default authRoutes;