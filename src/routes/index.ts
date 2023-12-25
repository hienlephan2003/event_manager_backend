import { Application } from "express";
const authRouter = require("./auth");
const eventRouter = require("./event");
const showTimeRouter = require("./showTime");
const ticketRouter = require("./ticket");
const addressRouter = require("./address");
const myRouter = require("./my");
const paymentRouter = require("./payment");
const discountRouter = require("./discount");
const userRouter = require("./user");
const chartRouter = require("./chart");
const imageRouter = require("./image");
const bookingRouter = require("./booking");
const stageRouter = require("./stage");
const parameterRoute = require('./parameter')
const organizerRouter = require("./organizer");
function Routes(app: Application) {
  app.use("/api", authRouter);
  app.use("/api/event", eventRouter);
  app.use("/api/showtime", showTimeRouter);
  app.use("/api/ticket", ticketRouter);
  app.use("/api/address", addressRouter);
  app.use("/api/my", myRouter);
  app.use("/api/payment", paymentRouter);
  app.use("/api/discount", discountRouter);
  app.use("/api/user", userRouter);
  app.use("/api/chart", chartRouter);
  app.use("/api/image", imageRouter);
  app.use("/api/stage", stageRouter);
  app.use("/api/booking", bookingRouter);
  app.use("/api/organizer", organizerRouter);
  app.use("/api/parameter", parameterRoute);
}
module.exports = Routes;
