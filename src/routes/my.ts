
import express from "express";
const router = express.Router();
import myController from "../controllers/myController";

router.get("/my_events/:id", myController.getAllEvents);
router.get('/my_events/:id/search', myController.searchMyEvent);
module.exports = router