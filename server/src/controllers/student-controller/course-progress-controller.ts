import type { Request, Response } from "express";
import logger from "../../config/logger.js";
import Progress from "../../models/CourseProgress.js";
import Course from "../../models/Course.js";
import StudentCourses from "../../models/StudentCourse.js";

const markCurrentLectureAsViewed = async (req: Request, res: Response) => {
    try {
        const { userId, courseId, lectureId } = req.body;

        let progress = await Progress.findOne({
            userId,
            courseId,
        });

        if (!progress) {
            progress = new Progress({
                userId: userId,
                courseId: courseId,
                lecturesProgress: [
                    {
                        lectureId: lectureId,
                        viewed: true,
                        dateViewed: new Date(),
                    },
                ],
            });

            await progress.save();
        } else {
            const lectureProgress = progress.lecturesProgress.find(
                (item) => item.lectureId === lectureId
            );

            if (lectureProgress) {
                lectureProgress.viewed = true;
                lectureProgress.dateViewed = new Date();
            } else {
                progress.lecturesProgress.push({
                    lectureId: lectureId,
                    viewed: true,
                    dateViewed: new Date(),
                });
            }

            await progress.save();
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        const allLecturesViewed =
            progress.lecturesProgress.length === course.curriculum.length &&
            progress.lecturesProgress.every((item) => item.viewed);

        if (allLecturesViewed) {
            progress.completed = true;
            progress.completionDate = new Date();

            await progress.save();
        }

        return res.status(200).json({
            success: true,
            message: "Lecture marked as viewed",
            data: progress,
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const getCurrentCourseProgress = async (req: Request, res: Response) => {
    try {
        const { userId, courseId } = req.params;

        const studentPurchasedCourses = await StudentCourses.findOne({
            userId,
        });

        if (!studentPurchasedCourses) {
            return res.status(200).json({
                success: true,
                data: {
                    isPurchased: false,
                },
                message: "You need to purchase course first",
            });
        }

        const blnCurrentCoursePurchasedByCurrentUserOrNot =
            studentPurchasedCourses?.courses?.findIndex(
                (item) => item.courseId === courseId
            ) > -1;

        if (!blnCurrentCoursePurchasedByCurrentUserOrNot) {
            return res.status(200).json({
                success: true,
                data: {
                    isPurchased: false,
                },
                message: "You need to purchase this course to access it.",
            });
        }

        const currentCourseProgress = await Progress.findOne({
            userId,
            courseId,
        });

        if (
            !currentCourseProgress ||
            currentCourseProgress.lecturesProgress.length === 0
        ) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "No progress found, you can start watching the course",
                data: {
                    courseDetails: course,
                    progress: [],
                    isPurchased: true,
                },
            });
        }

        const courseDetails = await Course.findById(courseId);

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                isPurchased: true,
                progress: currentCourseProgress.lecturesProgress,
                completed: currentCourseProgress.completed,
                completionDate: currentCourseProgress.completionDate,
            },
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const resetCurrentCourseProgress = async (req: Request, res: Response) => {
    try {
        const { userId, courseId } = req.body;

        const progress = await Progress.findOne({ userId, courseId });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: "Progress not found!",
            });
        }

        progress.completed = false;
        progress.lecturesProgress.splice(0, progress.lecturesProgress.length);
        progress.completionDate = null;

        await progress.save();
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};
export {
    markCurrentLectureAsViewed,
    resetCurrentCourseProgress,
    getCurrentCourseProgress,
};
