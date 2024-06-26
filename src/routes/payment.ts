import express from "express";
const router = express.Router();
import paymentController from "../controllers/paymentController";
// REGISTRATION
router.post("/createPayment", paymentController.createNewPayment);
router.post("/createPayment2", paymentController.createPaymentv2);
router.post("/verifyPayment", paymentController.verifyPaymentResult);
router.post("/refund", paymentController.refundPayment);
// LOGIN

module.exports = router;
