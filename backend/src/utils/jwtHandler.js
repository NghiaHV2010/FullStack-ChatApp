import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET, NODE_ENV } from "../config/env.config.js";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30m" });
    const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: "1d" });
    res.cookie("accessToken", token, {
        maxAge: 10 * 60 * 1000, //milisecond
        httpOnly: true, //prevent XSS attacks cross-site scriptiong attacks
        sameSite: "strict", //CSRF attacks cross-site request forgery attacks
        secure: NODE_ENV !== "development" //https = true | http = false
    });

    res.cookie("refreshToken", refreshToken, {
        maxAge: 24 * 60 * 1000, //milisecond
        httpOnly: true, //prevent XSS attacks cross-site scriptiong attacks
        sameSite: "strict", //CSRF attacks cross-site request forgery attacks
        secure: NODE_ENV !== "development" //https = true | http = false
    });

    return token;
}