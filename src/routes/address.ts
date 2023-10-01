import express from "express";
const router = express.Router();
import addressController from "../controllers/addressController";

router.get("/:id", addressController.getAddress);

module.exports = router