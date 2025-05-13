import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import { HTTP_ERROR, HTTP_SUCCESS } from "../constants/httpCode.js";
import { errorHandler } from "../utils/errorHandler.js";
import { generateToken } from "../utils/jwtHandler.js";
import cloudinary from "../config/cloudinay.config.js";

export const signup = async (req, res, next) => {
    const { fullName, email, password, profilePic } = req.body;
    try {
        if (password.length < 6) {
            return next(errorHandler(HTTP_ERROR.BAD_REQUEST, 'Password must be at least 6 characters'));
        }

        if (!fullName || !email) {
            return next(errorHandler(HTTP_ERROR.BAD_REQUEST, "Missing required field!"));
        }

        const user = await User.findOne({ email });

        if (user) {
            return next(errorHandler(HTTP_ERROR.BAD_REQUEST, "Email already existed!"));
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashPassword
        });

        if (newUser) {
            // generate token
            generateToken(newUser._id, res);
            await newUser.save();
          
            res.status(HTTP_SUCCESS.OK).json({
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            });
        } else {
            return next(errorHandler(HTTP_ERROR.BAD_REQUEST, "Invalid user data!"));
        }

    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(errorHandler(HTTP_ERROR.BAD_REQUEST, "Invalid credentials"))
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return next(errorHandler(HTTP_ERROR.BAD_REQUEST, "Invalid credentials"))
        }

        generateToken(user._id, res);

        res.status(HTTP_SUCCESS.OK).json({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {
    try {
        res.cookie("accessToken", "", { maxAge: 0 });
        res.cookie("refreshToken", "", { maxAge: 0 });
        res.status(HTTP_SUCCESS.OK).json({
            message: "Logout successfully!"
        })
    } catch (error) {
        next(error);
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return next(errorHandler(HTTP_ERROR.BAD_REQUEST, "Profile Picture is required"))
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, { new: true })

        res.status(HTTP_SUCCESS.OK).json({
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
}

export const checkAuth = (req, res, next) => {
    try {
        res.status(HTTP_SUCCESS.OK).json({
            data: req.user
        })
    } catch (error) {
        next(error);
    }
}