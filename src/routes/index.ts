import { Application } from "express"
const authRouter = require('./auth')
const eventRouter = require('./event')
const showTimeRouter = require('./showTime')
const ticketRouter = require('./ticket')
const stageRouter = require('./stage')
const addressRouter = require('./address')
const myRouter = require('./my')
function Routes(app:Application) {
app.use("/api", authRouter);
app.use("/api/event", eventRouter);
app.use("/api/showtime", showTimeRouter);
app.use("/api/stage", stageRouter)
app.use("/api/ticket", ticketRouter)
app.use("/api/address", addressRouter)
app.use("/api/my", myRouter)
}
module.exports = Routes;