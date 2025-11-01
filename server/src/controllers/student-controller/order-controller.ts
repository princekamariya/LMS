import express, { type Request, type Response } from "express";
import Course from "../../models/Course.js";
import Order from "../../models/Order.js";
import logger from "../../config/logger.js";
import client from "../../helpers/paypal.js";
import {
    ApiError,
    CheckoutPaymentIntent,
    Client,
    Environment,
    LogLevel,
    OrdersController,
    type OrderRequest,
} from "@paypal/paypal-server-sdk";
import StudentCourses from "../../models/StudentCourse.js";

const createOrder = async (req: Request, res: Response) => {
    try {
        const {
            userId,
            userName,
            userEmail,
            orderStatus,
            paymentMethod,
            paymentStatus,
            orderDate,
            paymentId,
            payerId,
            instructorId,
            instructorName,
            courseImage,
            courseTitle,
            courseId,
            coursePricing,
        } = req.body;
        const ordersController = new OrdersController(client);

        const orderRequest: OrderRequest = {
            intent: CheckoutPaymentIntent.Capture,
            payer: {
                emailAddress: userEmail,
                payerId: payerId,
                name: {
                    givenName: userName,
                },
            },
            purchaseUnits: [
                {
                    referenceId: courseId as string,
                    description: courseTitle as string,
                    amount: {
                        currencyCode: "USD",
                        value: coursePricing.toFixed(2),
                    },
                },
            ],
            applicationContext: {
                returnUrl: `${process.env.CLIENT_URL}/payment-return`,
                cancelUrl: `${process.env.CLIENT_URL}/payment-cancel`,
            },
        };

        try {
            const { result, ...httpResponse } =
                await ordersController.createOrder({ body: orderRequest });

            const newlyCreatedCourseOrder = new Order({
                userId,
                userName,
                userEmail,
                orderStatus,
                paymentMethod,
                paymentStatus,
                orderDate,
                paymentId,
                payerId,
                instructorId,
                instructorName,
                courseImage,
                courseTitle,
                courseId,
                coursePricing,
            });

            await newlyCreatedCourseOrder.save();
            const approveUrl = result.links?.find(
                (link) => link.rel === "approve"
            )?.href;

            return res.status(201).json({
                success: true,
                data: {
                    approveUrl,
                    orderId: newlyCreatedCourseOrder._id,
                },
            });
        } catch (error) {
            if (error instanceof ApiError) {
                const errors = error.result;
                logger.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Error occured in payment gateway paypal",
                });
            }
        }
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const capturePaymentAndFinalizeOrder = async (req: Request, res: Response) => {
    try {
        const { paymentId, payerId, orderId } = req.body;

        let order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = paymentId;
        order.payerId = payerId;

        await order.save();

        const studentCourses = await StudentCourses.findOne({
            userId: order.userId,
        });

        if (studentCourses) {
            studentCourses.courses.push({
                courseId: order.courseId,
                title: order.courseTitle,
                instructorId: order.instructorId,
                instructorName: order.instructorName,
                dateOfPurchase: order.orderDate,
                courseImage: order.courseImage,
            });

            await studentCourses.save();
        } else {
            const newStudentCourses = new StudentCourses({
                userId: order.userId,
                courses: [
                    {
                        courseId: order.courseId,
                        title: order.courseTitle,
                        instructorId: order.instructorId,
                        instructorName: order.instructorName,
                        dateOfPurchase: order.orderDate,
                        courseImage: order.courseImage,
                    },
                ],
            });

            await newStudentCourses.save();
        }

        await Course.findByIdAndUpdate(order.courseId, {
            $addToSet: {
                students: {
                    studentId: order.userId,
                    studentName: order.userName,
                    studentEmail: order.userEmail,
                    paidAmount: order.coursePricing,
                },
            },
        });

        return res.status(200).json({
            success: true,
            message: "Order confirmed",
            data: order,
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
        });
    }
};

export { createOrder, capturePaymentAndFinalizeOrder };
