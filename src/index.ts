import express, { Application, Request, Response } from "express"
// const express = require('express')
const app:Application = express()
// import dotenv from 'dotenv'
// import mongoose from 'mongoose'
// import bodyParser from 'body-parser'
// import routes from 'routes'
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const muilter = require('multer')
const upload = muilter()
 const cors = require('cors')
const routes = require('./routes')
dotenv.config();
app.use(cors({ credentials: true, origin: true })); 
app.use(bodyParser.json())
app.use(upload.array()); 
app.use(bodyParser.urlencoded({extended: true}))
app.get("/", (req:Request, res:Response):void => {
    res.send("Hello Typescript with Node.js!")
  });
  
mongoose.connect(process.env.MONGO_URL)
    .then(()=> console.log("Database is connected"))
    .catch((err:Error)=> {console.log(err)});
const server = app.listen(process.env.PORT || 3000, () => console.log(`Example app listening on port ${process.env.PORT || 3000}!`))
routes(app)
