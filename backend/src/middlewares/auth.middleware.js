import { JWT_REFRESH_SECRET, JWT_SECRET, NODE_ENV } from "../config/env.config.js";
import { HTTP_ERROR } from "../constants/httpCode.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    let newAccessToken;
    let userId;
    try {
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                return next(errorHandler(HTTP_ERROR.UNAUTHORIZED, "Unauthorized - No token provided!"));
            }

            const refreshTokenDecoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

            if (!refreshTokenDecoded) {
                return next(errorHandler(HTTP_ERROR.UNAUTHORIZED, "Unauthorized - Invalid token!"));
            }

            userId = refreshTokenDecoded.userId;

            newAccessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30m" });
            res.cookie("accessToken", newAccessToken, {
                maxAge: 30 * 60 * 1000, //milisecond
                httpOnly: true, //prevent XSS attacks cross-site scriptiong attacks
                sameSite: "strict", //CSRF attacks cross-site request forgery attacks
                secure: NODE_ENV !== "development" //https = true | http = false
            });
        } else {
            const accessTokenDecoded = jwt.verify(accessToken, JWT_SECRET);

            if (!accessTokenDecoded) {
                return next(errorHandler(HTTP_ERROR.UNAUTHORIZED, "Unauthorized - Invalid token!"));
            }

            userId = accessTokenDecoded.userId;
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return next(errorHandler(HTTP_ERROR.NOT_FOUND, "User not found!"))
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;
