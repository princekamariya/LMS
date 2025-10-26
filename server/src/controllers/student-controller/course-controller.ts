import type { Request, Response } from "express";
import Course from "../../models/Course.js";
import logger from "../../config/logger.js";
import StudentCourses from "../../models/StudentCourse.js";

interface CourseFilters {
    category?: { $in: string[] };
    level?: { $in: string[] };
    primaryLanguage?: { $in: string[] };
}

interface SortParams {
    [key: string]: 1 | -1;
}

const getAllStudentViewCourse = async (req: Request, res: Response) => {
    try {
        const {
            category,
            level,
            primaryLanguage,
            sortBy = "price-lowtohigh",
        } = req.query;

        let filters: CourseFilters = {};
        if (typeof category === "string" && category.length > 0) {
            filters.category = { $in: category.split(",") };
        }
        if (typeof level === "string" && level.length > 0) {
            filters.level = { $in: level.split(",") };
        }
        if (typeof primaryLanguage === "string" && primaryLanguage.length > 0) {
            filters.primaryLanguage = { $in: primaryLanguage.split(",") };
        }

        let sortParam: SortParams = {};
        switch (sortBy) {
            case "price-lowtohigh":
                sortParam.pricing = 1;
                break;
            case "price-hightolow":
                sortParam.pricing = -1;
                break;
            case "title-atoz":
                sortParam.title = 1;
                break;
            case "title-ztoa":
                sortParam.title = -1;
                break;
            default:
                sortParam.pricing = 1;
                break;
        }

        const courseList = await Course.find(filters).sort(sortParam);

        return res.status(200).json({
            success: true,
            data: courseList,
            message: "Course list fetched successfully",
        });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const getStudentViewCourseDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const courseDetails = await Course.findById(id);

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "No course details found",
                data: null,
            });
        }

        res.status(200).json({
            success: true,
            data: courseDetails,
            message: "Course details fetched successfully",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const checkCoursePurchaseInfo = async (req: Request, res: Response) => {
    try {
        const { id, studentId } = req.params;
        const studentCourses = await StudentCourses.findOne({
            userId: studentId,
        });
        if (!studentCourses) {
            return res.status(200).json({
                success: true,
                data: false,
            });
        }
        const blnStudentAlreadyBoughtParticularCourse =
            studentCourses?.courses.findIndex((item) => item.courseId === id) >
            -1;

        return res.status(200).json({
            success: true,
            data: blnStudentAlreadyBoughtParticularCourse,
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

export {
    getAllStudentViewCourse,
    getStudentViewCourseDetails,
    checkCoursePurchaseInfo,
};
