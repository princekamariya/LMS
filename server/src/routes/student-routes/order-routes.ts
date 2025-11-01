import {
    capturePaymentAndFinalizeOrder,
    createOrder,
} from "../../controllers/student-controller/order-controller.js";
import express from "express";

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePaymentAndFinalizeOrder);

export default router;
