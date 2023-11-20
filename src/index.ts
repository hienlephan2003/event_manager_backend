import express, { Application, Request, Response } from "express";
// const express = require('express')
const app: Application = express();
// import dotenv from 'dotenv'
// import mongoose from 'mongoose'
// import bodyParser from 'body-parser'
// import routes from 'routes'
import dotenv from "dotenv";
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
import path from "path";
const multer = require("multer");
import crypto from "crypto";

const Grid = require("gridfs-stream");
const { GridFsStorage } = require("multer-gridfs-storage");

dotenv.config();
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req: Request, res: Response): void => {
  res.send("Hello Typescript with Node.js!");
});
let gfs: any;

const conn = mongoose
  .connect(process.env.MONGO_URL)
  .then((db: any) => {
    console.log("Database is connected");
    gfs = Grid(db.connection.db, mongoose.mongo);
    gfs.collection("uploads");
  })
  .catch((err: Error) => {
    console.log(err);
  });

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URL,
  file: (req: any, file: any) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });
routes(app);

app.get("/file", (req, res) => {
  gfs.files.find().toArray((err: any, files: any) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render("index", { files: false });
    } else {
      files.map((file: any) => {
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png"
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render("index", { files: files });
    }
  });
});

// @route POST /upload
// @desc  Uploads file to DB
app.post("/file/upload", (req, res) => {
  console.log(req.files);
  // res.json({ file: req.file });
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.json({ file: req.file });
});

// @route GET /files
// @desc  Display all files in JSON
app.get("file/files", (req, res) => {
  gfs.files.find().toArray((err: any, files: any) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist",
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display single file object
app.get("file/files/:filename", (req, res) => {
  gfs.files.findOne(
    { filename: req.params.filename },
    (err: any, file: any) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exists",
        });
      }
      // File exists
      return res.json(file);
    }
  );
});

// @route GET /image/:filename
// @desc Display Image
app.get("file/image/:filename", (req, res) => {
  gfs.files.findOne(
    { filename: req.params.filename },
    (err: any, file: any) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exists",
        });
      }

      // Check if image
      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/png"
      ) {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: "Not an image",
        });
      }
    }
  );
});

// @route DELETE /files/:id
// @desc  Delete file
app.delete("file/files/:id", (req, res) => {
  gfs.remove(
    { _id: req.params.id, root: "uploads" },
    (err: any, gridStore: any) => {
      if (err) {
        return res.status(404).json({ err: err });
      }

      res.redirect("/");
    }
  );
});

const server = app.listen(process.env.PORT || 3000, () =>
  console.log(`Example app listening on port ${process.env.PORT || 3000}!`)
);
