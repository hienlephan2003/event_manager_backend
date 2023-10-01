
import express from "express";
const router = express.Router();
const {verifyToken} = require("../middlewares/verifyToken")
import eventController from "../controllers/eventController";
// CREATE EVENT 
router.post("/", verifyToken ,eventController.createEvent);
//UPDATE EVENT
router.put("/:id", verifyToken ,eventController.updateEvent);
//DELETE EVENT
router.delete("/:id", verifyToken , eventController.deleteEvent);
//GET EVENT BY ID
router.get("/:id" ,eventController.getEvent);
//GET ALL EVENT
router.get("/" ,eventController.getAllEvents);

router.get("/showTime/:id", eventController.getAllShowTimesOfEvent);
//SEARCH EVENT
// router.get("/search/:key" , eventController.searchEvents);


module.exports = router