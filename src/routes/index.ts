import { Application } from "express"
const authRouter = require('./auth')
const eventRouter = require('./event')
const showTimeRouter = require('./showTime')
const ticketRouter = require('./ticket')
const stageRouter = require('./stage')
const addressRouter = require('./address')
function Routes(app:Application) {
app.use("/api", authRouter);
app.use("/api/event", eventRouter);
app.use("/api/showTime", showTimeRouter);
app.use("/api/stage", stageRouter)
app.use("/api/ticket", ticketRouter)
app.use("/api/address", addressRouter)
}
module.exports = Routes;