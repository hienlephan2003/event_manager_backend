import express from "express";
const router = express.Router();
import parameterController from "../controllers/parameterController";
router.get("/commission", parameterController.getCommission);
router.post("/", parameterController.create);
module.exports = router;