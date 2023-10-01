import express from "express";
const router = express.Router();
import showtimeController from "../controllers/showTimeController";
const {verifyToken} = require("../middlewares/verifyToken")

// CREATE SHOWTIME 
router.post("/", verifyToken ,showtimeController.createShowTimes);
//UPDATE SHOWTIME
router.put("/:id", verifyToken ,showtimeController.updateShowTime);
//DELETE SHOWTIME
router.delete("/:id", verifyToken , showtimeController.deleteShowTime);
//GET SHOWTIME BY ID
router.get("/:id" ,showtimeController.getShowTime);


module.exports = router