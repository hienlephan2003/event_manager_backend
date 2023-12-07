import express from "express";
const router = express.Router();
import bookingController from "../controllers/bookingController";
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/holdTickets", bookingController.newHoldTickets);
router.get("/holdToken", verifyToken, bookingController.getHoldToken);
module.exports = router;
