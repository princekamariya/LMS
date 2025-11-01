import express from "express";
import {
    addNewCourse,
    getAllCourse,
    getCourseDetailsByID,
    updateCourseByID,
} from "../../controllers/instructor-controller/index.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", authenticate, addNewCourse);
router.get("/get", authenticate, getAllCourse);
router.get("/get/details/:id", authenticate, getCourseDetailsByID);
router.put("/update/:id", authenticate, updateCourseByID);

export default router;
