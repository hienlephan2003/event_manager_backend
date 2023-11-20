
import express, { response } from "express";
import userController from "../controllers/userController";
const router = express.Router();
// router.get("/showtime", userController.getAll)
// router.get("/:id", userController.getById)
router.post("/", userController.create)
router.get("/getBy", userController.getUserByEMail)
// router.patch("/:id", userController.update)
// router.delete("/:id", userController.delete)
module.exports = router