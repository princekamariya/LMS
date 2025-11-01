import express from "express";
import { getCourseByStudentId } from "../../controllers/student-controller/student-courses-controller.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get/:studentId", authenticate, getCourseByStudentId);

export default router;
