import type { Request, Response } from "express";
import StudentCourses from "../../models/StudentCourse.js";
import logger from "../../config/logger.js";

const getCourseByStudentId = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const studentBoughtCourses = await StudentCourses.findOne({
            userId: studentId,
        });

        return res.status(200).json({
            success: true,
            data: studentBoughtCourses?.courses,
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

export { getCourseByStudentId };
