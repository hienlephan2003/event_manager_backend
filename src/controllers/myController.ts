import { Request, Response } from "express"
import Event from "../models/Event"
const myController = {
    
    getAllEvents: async (req:Request, res:Response) =>{
        try{
          const events = await Event.find({
            organizerId: req.params.id,
           
          }).populate([
            {
              path: "stageId",
              populate: {
                path: "addressId",
              },
            },
            {
              path: "organizerId",
            },  'showtimes'
          ])
          
          
              res.status(200).json(events)
          // const eventDoc = await Event.aggregate([
          //   {
          //     $addFields: {
          //       stage: "fdf",
          //     }
          //   }
          // ])
         
        
            
    
            
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    searchMyEvent: async (req: Request, res: Response) => {
      try {
        const query = req.query;
        const str: string = query.q as string;
        const regex = new RegExp(str, "i");
        const results = await Event.find({
          organizerId: req.params.id,
          eventName: { $regex: regex }
        }).populate([
          {
            path: "stageId",
            populate: {
              path: "addressId",
            },
          },
          {
            path: "organizerId",
          },  'showtimes'
        ])
        
        res.status(200).json(results);
      } catch (err) {
        res.status(500).json(err);
      }
    },
}
export default myController
    