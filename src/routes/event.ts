
import express from "express";
const router = express.Router();
const {verifyToken} = require("../middlewares/verifyToken")
import eventController from "../controllers/eventController";
// CREATE EVENT 
router.post("/", verifyToken ,eventController.createEvent);
router.get('/filter', eventController.filterEvent);
router.get('/search', eventController.searchEvent);
router.get('/recommended',eventController.recommendedEvent);
router.get('/suggest',eventController.suggestEvent);


//UPDATE EVENT
router.put("/:id", verifyToken ,eventController.updateEvent);
//DELETE EVENT
router.delete("/:id", verifyToken , eventController.deleteEvent);
//GET EVENT BY ID
router.get("/detail/:id" ,eventController.getDetailEvent);
router.get("/:id" ,eventController.getEventById);

//GET ALL EVENT


router.get("/" ,eventController.getAllEvents);
router.get("/showTime/:id", eventController.getAllShowTimesOfEvent);
//SEARCH EVENT
// router.get("/search/:key" , eventController.searchEvents);
//ADD MODERATOR TO EVENT
router.post("/:event_id/createModerator", eventController.createModerator)

module.exports = router