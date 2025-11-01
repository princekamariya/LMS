import express from "express";
import {
    checkCoursePurchaseInfo,
    getAllStudentViewCourse,
    getStudentViewCourseDetails,
} from "../../controllers/student-controller/course-controller.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get", authenticate, getAllStudentViewCourse);
router.get("/get/details/:id", authenticate, getStudentViewCourseDetails);
router.get(
    "/purchase-info/:id/:studentId",
    authenticate,
    checkCoursePurchaseInfo
);

export default router;
