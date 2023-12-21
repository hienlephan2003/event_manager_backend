
import express from "express";
const router = express.Router();
import myController from "../controllers/myController";

router.get("/my_events/:userId", myController.getAllEvents);
router.get('/my_events/:userId/search', myController.searchMyEvent);
module.exports = router