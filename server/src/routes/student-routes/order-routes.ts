import {
    capturePaymentAndFinalizeOrder,
    createOrder,
} from "../../controllers/student-controller/order-controller.js";
import express from "express";
import authenticate from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", authenticate, createOrder);
router.post("/capture", authenticate, capturePaymentAndFinalizeOrder);

export default router;
