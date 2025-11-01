import express from "express";
import {
    getCurrentCourseProgress,
    markCurrentLectureAsViewed,
    resetCurrentCourseProgress,
} from "../../controllers/student-controller/course-progress-controller.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get/:userId/:courseId", authenticate, getCurrentCourseProgress);
router.post("/mark-lecture-viewed", authenticate, markCurrentLectureAsViewed);
router.post("/reset-progress", authenticate, resetCurrentCourseProgress);

export default router;
