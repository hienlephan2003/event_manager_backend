import express, { response } from "express";
const router = express.Router();
import imageController from "../controllers/imageController";
const multer = require("multer");
const multiparty = require("connect-multiparty");
const storage = multer.memoryStorage();
const MuiltiPartyMiddleware = multiparty({ uploadDir: "./images" });
const fileFilter = (req: Request, file: any, cb: Function) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter,
});

router.post("/upload", upload.single("file"), imageController.uploadImage);
router.get("/getImage/:id", imageController.getImageUrl);
module.exports = router;
