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

      return res.status(201).json(saveUser);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  checkPhoneNumber: async (req: Request, res: Response) => {
    try {
      const phoneNumber = req.body.phoneNumber;
      if (!phoneNumber) {
        return res.status(404).json("Missing required field");
      }
      console.log(phoneNumber);
      const user = await User.findOne({ phoneNumber: phoneNumber });
      if (user != null) {
        return res.status(201).json({
          message: "This phone number is exists in db, forward to login page",
        });
      }
      return res.status(200).json({ message: "success" });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  register: async (req: Request, res: Response) => {
    try {
      const phoneNumber = req.body.phoneNumber;
      console.log(phoneNumber);
      const user = await User.findOne({ phoneNumber: phoneNumber });
      if (phoneNumber != null && user != null) {
        return res.status(201).json({
          message: "This phone number is exists in db, forward to login page",
        });
      }
      const otp = await otpService.sendOTP("84" + phoneNumber.substring(1));
      return res.status(200).json({ message: "success" });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
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
      return response.status(200).json("success");
    } catch (err) {
      return response.status(500).json(err);
    }
  },
  setPassword: async (request: Request, response: Response) => {
    try {
      const phoneNumber = request.body.phoneNumber;
      const password = request.body.password;
      const findUser = await User.findOne({
        phoneNumber: phoneNumber,
      });
      if (findUser?.accountStatus != "new") {
        return response.status(403).json("this account is not a new one");
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
      return response.status(200).json("success");
    } catch (err) {
      return response.status(500).json(err);
    }
  },

  verifyOtp: async (req: Request, res: Response) => {
    try {
      const phoneNumber = req.body.phoneNumber;
      const password = req.body.password;
      const otp = req.body.otp;
      const result = await otpService.verifyOTP(
        "84" + phoneNumber.substring(1),
        otp
      );
      if (result == "approved") {
        const newUser = new User({
          phoneNumber: phoneNumber,
          password: CryptoJs.AES.encrypt(
            password,
            process.env.SECRET
          ).toString(),
        });
        await newUser.save();
        return res.status(200).json("approved");
      } else return res.status(403).json("disapproved");
    } catch (err) {
      console.log(err);
      return res.status(500).json("disapproved");
    }
  },
  loginUser: async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ phoneNumber: req.body.phoneNumber });

      if (!user) {
        return res.status(401).json("Wrong Login Details");
      }

      const descryptedPass = CryptoJs.AES.decrypt(
        user?.password,
        process.env.SECRET
      );
      const depassword = descryptedPass.toString(CryptoJs.enc.Utf8);

      if (depassword !== req.body.password)
        return res.status(401).json("Wrong password");

      const userToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.SECRET,
        { expiresIn: "21d" }
      );
      const userObj = user.toObject();
      return res.status(200).json({ ...userObj, userToken });
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  },
};
export default authController;
