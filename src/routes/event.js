const router = require("express").Router();
const eventController = require('../controllers/eventController');
const {verifyToken} = require("../middlewares/verifyToken")

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

router.get("/showTime/:id", eventController.getAllShowTimes);
//SEARCH EVENT
// router.get("/search/:key" , eventController.searchEvents);


module.exports = router