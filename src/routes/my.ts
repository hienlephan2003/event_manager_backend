
import express from "express";
const router = express.Router();
import myController from "../controllers/myController";

router.get("/my_events", myController.getAllEvents);

module.exports = router