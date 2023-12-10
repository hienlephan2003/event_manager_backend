import express, { response } from "express";
const router = express.Router();
import chartController from "../controllers/chartController";
import eventController from "../controllers/eventController";
const { verifyToken } = require("../middlewares/verifyToken");
router.post("/newDraft", chartController.createNewChart);
router.post("/newEvent", chartController.addNewEvent);
router.post("/validate", chartController.validateChart);
router.post("/addNewEvent", chartController.addNewEvent);
router.get("/allCharts", chartController.getAllChart);
router.post("/addCategories", chartController.addCategories);
router.post("/categories", chartController.getCategories);
module.exports = router;
