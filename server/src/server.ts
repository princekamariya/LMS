import express, {
    type NextFunction,
    type Request,
    type Response,
} from "express";
import cors from "cors";
import connectDB from "./config/config.js";
import logger from "./config/logger.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth-routes/index.js";
import instructorCourseRoutes from "./routes/instructor-routes/course-route.js";
import studentViewCourseRoutes from "./routes/student-routes/course-routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: process.env.CLIENT_URL,
    allowedHeaders: ["Content-Type", "Authorization"],
});

app.use(express.json());
app.use(cors());
app.use("/auth/", authRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    return res.status(500).json({
        success: false,
        message: "Something went wrong",
    });
});
app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
});
