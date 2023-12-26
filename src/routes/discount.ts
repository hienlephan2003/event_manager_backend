import express, { response } from "express";
const router = express.Router();
import discountController from "../controllers/discountController";
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/showtime", discountController.getAll);
router.get("/:id", discountController.getById);
router.get("/", discountController.findAll);
router.post("/", discountController.create);
router.patch("/:id", discountController.update);
router.delete("/:id", discountController.delete);
router.post("/validate", verifyToken, discountController.checkDiscount);
router.get("/event/:id", verifyToken, discountController.getDiscountsOfEvent);
module.exports = router;
