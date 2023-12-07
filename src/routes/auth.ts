import express from "express";
const router = express.Router();
import authController from "../controllers/authController";
// REGISTRATION
router.post("/checkPhoneNumber", authController.checkPhoneNumber);
router.post("/register", authController.register);
router.post("/verifyOtp", authController.verifyOtp);
// LOGIN
router.post("/login", authController.loginUser);

module.exports = router;
