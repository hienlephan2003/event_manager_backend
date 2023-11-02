import express from "express";
const router = express.Router();
import authController from "../controllers/authController";
// REGISTRATION
router.post("/register", authController.registerUser);
router.post("/register/otp", authController.verifyOtp);
// LOGIN
router.post("/login", authController.loginUser);

module.exports = router;
