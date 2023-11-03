import { Model, Document } from "mongoose";
import { UserDocument, User } from "../models/User";
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
import otpService from "../services/otpService";
import { Request, Response } from "express";
const authController = {
  updateUserInfo: async (req: Request, res: Response) => {
    const newUser = new User({
      email: req.body.email,
      imageUrl: req.body.imageUrl ?? "",
      dateOfBirth: req.body.dateOfBirth ?? null,
      accountStatus: "verified",
    });

    try {
      const saveUser = await newUser.save();

      res.status(201).json(saveUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  registerUser: async (req: Request, res: Response) => {
    try {
      const phoneNumber = req.body.phoneNumber;
      const user = await User.findOne({ phoneNumber: phoneNumber });
      if (user != null) {
        res.status(403).json({
          message: "This phone number is exists in db, forward to login page",
        });
      }
      const otp = await otpService.sendOTP(phoneNumber);
      res.status(201).json({ message: "success" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // forgotPassword: async (request: Request, response: Response) => {
  //   try{
  //     const generateToken =
  //   }
  //   cacth(err){
  //     res.status(500).json(err);
  //   }
  // },
  recoveryPassword: async (request: Request, response: Response) => {
    try {
      const userId = request.body.user.id;
      const newPassword = request.body.password;
      const user = await User.findByIdAndUpdate(userId, {
        password: CryptoJs.AES.encrypt(
          newPassword,
          process.env.SECRET
        ).toString(),
      });
      await user?.save();
      response.status(200).json("success");
    } catch (err) {
      response.status(500).json(err);
    }
  },
  // sendForgotPasswordMessage: async (request: Request, response: Response) => {
  //   try {
  //     const accountSid = "AC7f071b9da3b2b18765f4a65a129670f8";
  //     const authToken = "[AuthToken]";
  //     const client = require("twilio")(accountSid, authToken);

  //     client.messages
  //       .create({
  //         to: "+84862622563",
  //       })
  //       .then((message:any) => console.log(message.sid))
  //       .done();
  //     response.status(200).json("success");
  //   } catch (err) {
  //     response.status(500).json(err);
  //   }
  // },
  setPassword: async (request: Request, response: Response) => {
    try {
      const phoneNumber = request.body.phoneNumber;
      const password = request.body.password;
      const findUser = await User.findOne({
        phoneNumber: phoneNumber,
      });
      if (findUser?.accountStatus != "new") {
        response.status(403).json("this account is not a new one");
      }
      const updateUser = await User.findOneAndUpdate(
        { phoneNumber: phoneNumber },
        {
          password: CryptoJs.AES.encrypt(
            password,
            process.env.SECRET
          ).toString(),
        }
      );
      await updateUser?.save();
      response.status(200).json("success");
    } catch (err) {
      response.status(500).json(err);
    }
  },

  verifyOtp: async (req: Request, res: Response) => {
    try {
      const phoneNumber = req.body.phoneNumber;
      const otp = req.body.otp;
      const result = await otpService.verifyOTP(phoneNumber, otp);
      if (result == "approved") {
        const newUser = new User({
          phoneNumber: phoneNumber,
        });
        await newUser.save();
      }
      res.status(201).json("approved");
    } catch (err) {
      res.status(500).json("disapproved");
    }
  },
  loginUser: async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
        res.status(401).json("Wrong Login Details");
        return;
      }

      const descryptedPass = CryptoJs.AES.decrypt(
        user?.password,
        process.env.SECRET
      );
      const depassword = descryptedPass.toString(CryptoJs.enc.Utf8);

      depassword !== req.body.password &&
        res.status(401).json("Wrong password");

      const userToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.SECRET,
        { expiresIn: "21d" }
      );
      const userObj = user.toObject();
      res.status(200).json({ ...userObj, userToken });
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  },
};
export default authController;
