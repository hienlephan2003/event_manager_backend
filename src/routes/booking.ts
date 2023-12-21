import express from "express";
const router = express.Router();
import bookingController from "../controllers/bookingController";
import { verifyToken } from "../middlewares/verifyToken";
router.post("/holdTickets", bookingController.newHoldTickets);
router.get("/holdToken", verifyToken, bookingController.getHoldToken);
router.post(
  "/createNewBooking",
  verifyToken,
  bookingController.createNewBooking
);
router.post("/deleteBooking", bookingController.deleteBooking);
router.post("/bookingDemo", bookingController.bookingTicketsDemo);
module.exports = router;
