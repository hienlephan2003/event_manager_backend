const router = require("express").Router();
const showTimeController = require('../controllers/showTimeController');
const {verifyToken} = require("../middlewares/verifyToken")

// CREATE SHOWTIME 
router.post("/", verifyToken ,showTimeController.createShowTimes);
//UPDATE SHOWTIME
router.put("/:id", verifyToken ,showTimeController.updateShowTime);
//DELETE SHOWTIME
router.delete("/:id", verifyToken , showTimeController.deleteShowTime);
//GET SHOWTIME BY ID
router.get("/:id" ,showTimeController.getShowTime);


module.exports = router