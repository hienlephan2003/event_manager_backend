import express from "express";
const router = express.Router();
import authController from "../controllers/authController";
// REGISTRATION 
router.post("/register", authController.createUser);
// LOGIN 
router.post("/login", authController.loginUser);


module.exports = router