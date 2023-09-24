const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const authRouter = require('./src/routes/auth')
const eventRouter = require('./src/routes/event')

dotenv.config();
mongoose.connect(process.env.MONGO_URL)
    .then(()=> console.log("Database is connected"))
    .catch((err)=> {console.log(err)});
app.use(cors({ credentials: true, origin: true })); 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use("/api", authRouter);
app.use("/api/event", eventRouter)

const server = app.listen(process.env.PORT || 3000, () => console.log(`Example app listening on port ${process.env.PORT || 3000}!`))
