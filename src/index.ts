import express, { Application, Request, Response } from "express";
const app: Application = express();
import dotenv from "dotenv";
import { logger } from "./utils/logger";
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
const morgan = require("morgan");
dotenv.config();
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const morganMiddleware = morgan(
  function (tokens: any, req: Request, res: Response) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      content_length: tokens.res(req, res, "content-length"),
      response_time: Number.parseFloat(tokens["response-time"](req, res)),
    });
  },
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message: any) => {
        const data = JSON.parse(message);
        logger.http(`incoming-request`, data);
      },
    },
  }
);

app.use(morganMiddleware);
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
