import express, { Application, Request, Response } from "express";
const app: Application = express();
import dotenv from "dotenv";
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
const multer = require("multer");
const Grid = require("gridfs-stream");

dotenv.config();
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req: Request, res: Response): void => {
  res.send("Hello Typescript with Node.js!");
});
mongoose
  .connect(process.env.MONGO_URL)
  .then((db: any) => {
    console.log("Database is connected");
  })
  .catch((err: Error) => {
    console.log(err);
  });

routes(app);

const server = app.listen(process.env.PORT || 3000, () =>
  console.log(`Example app listening on port ${process.env.PORT || 3000}!`)
);
