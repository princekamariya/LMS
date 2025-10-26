import type { Request, Response } from "express";
import Course from "../../models/Course.js";
import logger from "../../config/logger.js";

export const addNewCourse = async (req: Request, res: Response) => {
    try {
        const courseData = req.body;
        const newlyCreatedCourse = new Course(courseData);
        const saveCourse = await newlyCreatedCourse.save();

        if (saveCourse) {
            return res.status(201).json({
                success: true,
                message: "Course saved successfully",
                data: saveCourse,
            });
        }
    } catch (e) {
        logger.error(e);
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

export const getAllCourse = async (req: Request, res: Response) => {
    try {
        const coursesList = await Course.find({});

        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            data: coursesList,
        });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

export const getCourseDetailsByID = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const courseDetails = await Course.findById(id);

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found!",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,
        });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

export const updateCourseByID = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedCourseData = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            updatedCourseData,
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found!",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};
