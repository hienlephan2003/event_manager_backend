
import express from "express";
const router = express.Router();
import myController from "../controllers/myController";
const { verifyToken } = require("../middlewares/verifyToken");
router.get("/my_events/:userId", myController.getAllEvents);
router.get('/my_events/:userId/search', myController.searchMyEvent);
router.get('/tickets', verifyToken , myController.getMyTickets);
router.get('/discounts', verifyToken , myController.getMyDiscount);
module.exports = router