import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface UserPayload extends JwtPayload {
    _id: string;
    userEmail: string;
    userName: string;
    role: string;
}

interface RequestWithUser extends Request {
    user?: UserPayload;
}

const verifyToken = (token: string, secretKey: string) => {
    return jwt.verify(token, secretKey) as UserPayload;
};

const authenticate = (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "User is not authenticated",
        });
    }

    const token: string | undefined = authHeader.split(" ")[1];

    try {
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated",
            });
        }
        const payload = verifyToken(token, "SECRET");

        req.user = payload;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

export default authenticate;
