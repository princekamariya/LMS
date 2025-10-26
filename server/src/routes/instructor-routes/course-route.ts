import express from "express";
import {
    addNewCourse,
    getAllCourse,
    getCourseDetailsByID,
    updateCourseByID,
} from "../../controllers/instructor-controller/index.js";

const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourse);
router.get("/get/details/:id", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);

export default router;
