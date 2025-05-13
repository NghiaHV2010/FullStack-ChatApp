import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSideBar, sendMessage } from "../controllers/message.controller.js";

const messageRoutes = Router();

messageRoutes.get("/users", authMiddleware, getUsersForSideBar);
messageRoutes.get("/:id", authMiddleware, getMessages);
messageRoutes.post("/send/:id", authMiddleware, sendMessage);


export default messageRoutes;