const router = require("express").Router();
const eventController = require('../controllers/eventController');
const {verifyToken} = require("../middlewares/verifyToken")

// CREATE EVENT 
router.post("/", verifyToken ,eventController.createEvent);
//UPDATE JOB
router.put("/:id", verifyToken ,eventController.updateEvent);
//DELETE JOB
router.delete("/:id", verifyToken , eventController.deleteEvent);
//GET JOB BY ID
router.get("/:id" ,eventController.getEvent);
//GET ALL JOB
router.get("/" ,eventController.getAllEvents);
//SEARCH JOB
// router.get("/search/:key" , eventController.searchEvents);


module.exports = router