import express, { response } from "express";
import userController from "../controllers/userController";
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();
// router.get("/showtime", userController.getAll)
// router.get("/:id", userController.getById)
router.get("/", userController.findAll);
router.post('/:eventId/confirmModerator', userController.confirmModerator)
router.get("/:eventId/moderator", userController.acceptModerator)
router.post("/", userController.create);
router.get("/getBy", userController.getUserByEMail);
router.post("/editProfile", verifyToken, userController.updateUser);

// router.patch("/:id", userController.update)
// router.delete("/:id", userController.delete)
module.exports = router;
