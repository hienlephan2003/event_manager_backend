import express, { response } from "express";
const router = express.Router();
import discountController from "../controllers/discountController";
const {verifyToken} = require("../middlewares/verifyToken")
router.get("/showtime", discountController.getAll)
router.get("/:id", discountController.getById)
router.post("/", discountController.create)
router.patch("/:id", discountController.update)
router.delete("/:id", discountController.delete)
module.exports = router