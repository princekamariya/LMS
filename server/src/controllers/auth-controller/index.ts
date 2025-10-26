import type { Request, Response } from "express";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import { RegisterValidation } from "../../validations/auth-validations/index.js";
import type { ZodError } from "zod";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
    const { userName, userEmail, password, role } = req.body;

    const result = RegisterValidation.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: (result.error as ZodError).issues[0]?.message,
        });
    }

    const existingUser = await User.findOne({
        $or: [{ userEmail: userEmail }, { userName: userName }],
    });

    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User name or user Email already exists",
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
        userEmail: userEmail,
        userName: userName,
        password: hashPassword,
        role: role,
    });

    return res.status(201).json({
        success: true,
        message: "User registered successfully!",
    });
};

export const loginUser = async (req: Request, res: Response) => {
    const { userEmail, password } = req.body;

    const checkUser = await User.findOne({ userEmail: userEmail });

    if (!checkUser || !checkUser.password) {
        return res.status(401).json({
            success: false,
            message: "Invalid Credentials",
        });
    }

    const isMatch = await bcrypt.compare(password, checkUser.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid Credentials",
        });
    }

    const accessToken = jwt.sign(
        {
            _id: checkUser._id,
            userEmail: checkUser.userEmail,
            userName: checkUser.userName,
            role: checkUser.role,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "120m",
        }
    );

    return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        data: {
            accessToken,
            user: {
                _id: checkUser._id,
                userEmail: checkUser.userEmail,
                userName: checkUser.userName,
                role: checkUser.role,
            },
        },
    });
};
