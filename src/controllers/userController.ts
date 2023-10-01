const User = require("../models/User");
const CryptoJs = require('crypto-js')
import { Request, Response } from "express";
const userController = {
    updateUser: async (req:Request, res:Response) => {
        if(req.body.password){
            req.body.password = CryptoJs.AES.encrypt(req.body.password, process.env.SECRET).toString()
        }
        try{
            // const UpdateUser = await User.findByIdAndUpdate(
            //     req.user.id, {
            //         $set: req.body,
            //     }, {new: true}
            // )
            //const {password, __v, createdAt, ...others} = UpdateUser._doc;
            
           // res.status(200).json(others)
        }
        catch(err) {
            res.status(500).json({err})
        }
    },
    deleteUser: async (req:Request, res:Response) =>{
        try{
            //await User.findByIdAndDelete(req.user.id)
            res.status(200).json("Account Successfully Deleted")
        }catch(er){
            res.status(500).json(er)
        }
    },
    getUser: async (req:Request, res:Response) =>{
        try{
            //const user =  await User.findById(req.user.id)
            // const {password, __v, createdAt, ...userData} = user._doc;
            // res.status(200).json(userData)
        }catch(er){
            res.status(500).json(er)
        }
    },
    getAllUser: async (req:Request, res:Response) =>{
        try{
            const allUser =  await User.find()
            res.status(200).json(allUser)
        }catch(er){
            res.status(500).json(er)
        }
    },
}