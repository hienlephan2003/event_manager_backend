import express from "express";
const router = express.Router();
import organizerController from "../controllers/organizerController";
import { verifyToken } from "../middlewares/verifyToken";
router.post("/newOrganizer", verifyToken, organizerController.createOrganizer);
router.get("/", verifyToken, organizerController.getOrganizer);
module.exports = router;
