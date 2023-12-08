const { User, UserDocument } = require("../models/User");
const http = require("http");
const CryptoJs = require("crypto-js");
const sendEmail = require("../utils/sendEmail");
import axios from "axios";
import bodyParser from "body-parser";
import { Request, Response } from "express";

const userController = {
  updateUser: async (req: Request, res: Response) => {
    if (req.body.password) {
      req.body.password = CryptoJs.AES.encrypt(
        req.body.password,
        process.env.SECRET
      ).toString();
    }
    try {
      if (req.body.user.id !== req.body._id) {
        console.log(req.body);
        return res
          .status(403)
          .json("You are restricted from performing this operation");
      }
      const UpdateUser = await User.findByIdAndUpdate(
        req.body.user.id,
        req.body,
        { new: true }
      );
      const { password, __v, createdAt, ...others } = UpdateUser._doc;

      res.status(200).json(others);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },
  deleteUser: async (req: Request, res: Response) => {
    try {
      //await User.findByIdAndDelete(req.user.id)
      res.status(200).json("Account Successfully Deleted");
    } catch (er) {
      res.status(500).json(er);
    }
  },
  getUser: async (req: Request, res: Response) => {
    try {
      //const user =  await User.findById(req.user.id)
      // const {password, __v, createdAt, ...userData} = user._doc;
      // res.status(200).json(userData)
    } catch (er) {
      res.status(500).json(er);
    }
  },
  getAllUser: async (req: Request, res: Response) => {
    try {
      const allUser = await User.find();
      res.status(200).json(allUser);
    } catch (er) {
      res.status(500).json(er);
    }
  },
  create: async (req: Request, res: Response) => {
    req.body.password = CryptoJs.AES.encrypt(
      req.body.password,
      process.env.SECRET
    ).toString();
    const user = new User(req.body);
    await user.save();
    res.json(user);
  },
  getUserByEMail: async (req: Request, res: Response) => {
    try {
      const email = req.query.email as String;
      const user = await User.findOne({ email: email });
      res.status(200).json(user);
    } catch (er) {
      res.status(500).json(er);
    }
  },
  confirmModerator: async (req: Request, res: Response) => {
    const eventId = req.params.eventId;
    const userId = req.body.userId;
    const role = req.body.role;
    const user = await User.findById(userId);
    const email = user.email;
    const url = `${process.env.BASE_URL}api/user/${eventId}/moderator?userId=${userId}&role=${role}`;
    try {
      await sendEmail(email, "Confirm moderator email", url);
      res.json("send email successfully")
    }
    catch (err) {
      throw err
    }
  },
  acceptModerator: async (req: Request, res: Response) => {
    const userId = req.query.userId;
    const role = req.query.role;
    const data = {
      userId,
      role,
    };
    const eventId = req.params.eventId;
    try {
      await axios.post(
        `${process.env.BASE_URL}api/event/${eventId}/createModerator`,
        data
      );
      res.json({
        message: "Add moderator successfully",
      });
    } catch (err) {
      throw err;
    }
  },
};
export default userController;
