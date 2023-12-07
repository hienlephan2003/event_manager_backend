import express from "express";
const router = express.Router();
import paymentController from "../controllers/paymentController";
// REGISTRATION
router.post("/createPayment", paymentController.createNewPayment);
router.post("/verifyPayment", paymentController.verifyPaymentResult);
// LOGIN

module.exports = router;
