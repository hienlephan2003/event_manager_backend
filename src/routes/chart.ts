import express, { response } from "express";
const router = express.Router();
import chartController from "../controllers/chartController";
const { verifyToken } = require("../middlewares/verifyToken");
router.post("/newDraft", chartController.createNewChart);
router.post("/validate", chartController.validateChart);
router.post("/addNewEvent", chartController.addNewEvent);
router.get("/allCharts", chartController.getAllChart);
module.exports = router;
