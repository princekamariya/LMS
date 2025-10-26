import type { Request, Response } from "express";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req: Request, res: Response) => {
    const { userName, userEmail, password, role } = req.body;

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
