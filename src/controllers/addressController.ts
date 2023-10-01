import { Request, Response } from "express"
import Address from "../models/Address"

const addressController = {
    
    getAddress: async (req:Request, res:Response) =>{
        try{
            const address = await Address.findById(req.params.id)
            res.status(200).json(address)
        }
        catch(err){
            res.status(500).json(err)
        }
    },
}
export default addressController
    