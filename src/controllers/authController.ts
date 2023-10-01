import User from "../models/User"
const CryptoJs = require('crypto-js')
const jwt = require("jsonwebtoken")

import { Request, Response } from "express"
const authController = {
    createUser: async (req:Request, res:Response) => {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJs.AES.encrypt(req.body.password, process.env.SECRET).toString(),
            role: req.body.role
        });

        try{
            const saveUser = await newUser.save();

            res.status(201).json(saveUser);

        }catch(err){
            res.status(500).json(err)
        }
    },

    loginUser: async (req:Request, res:Response) => {
        try{
            const user = await User.findOne({username : req.body.username, })
            if(!user){
             res.status(401).json("Wrong Login Details")
             return;
            } 

            const descryptedPass = CryptoJs.AES.decrypt(user.password, process.env.SECRET)
            const depassword = descryptedPass.toString(CryptoJs.enc.Utf8)

            depassword !== req.body.password && res.status(401).json("Wrong password")
            // const {password, __v, createdAt, ...others} = user._doc;

            // const userToken = jwt.sign({
            //     id: user._id, role: user.role
            // }, process.env.SECRET, {expiresIn: "21d"})

            // res.status(200).json({...others, userToken});

        }catch(e){
            console.log(e)
            res.status(500).json(e)
        }
    }
}
export default authController;