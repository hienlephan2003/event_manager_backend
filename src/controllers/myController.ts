import { Request, Response } from "express"
import Event from "../models/Event"
const myController = {
    
    getAllEvents: async (req:Request, res:Response) =>{
        try{
          //  const events = await Event.aggregate(
          //   [
          //     {
          //       $lookup: {
          //         from: "stages",
          //         localField: "stageId",
          //         foreignField: "_id",
          //         as: "stage"
          //       }
          //     },
          //     {
          //       $unwind: {
          //         path: "$stage",
          //         preserveNullAndEmptyArrays: true
          //       }
          //     },
          //     {
          //       $lookup: {
          //         from: "addresses",
          //         localField: "stage.addressId",
          //         foreignField: "_id",
          //         as: "address"
          //       }
          //     },
          //     {
          //       $unwind: {
          //         path: "$address",
          //         preserveNullAndEmptyArrays: true  
          //       } 
          //     },
          //     {
          //       $project: {
          //         _id: 0,
          //         startTime: {$dateToString: {date: "$startTime", format:"%d:%m:%Y"}},
          //         address: {$concat: ["$address.ward", ', ', "$address.district", ", ","$address.province"]},
          //         coverImage:1,
          //         eventName:1

          //       }
          //     }
          //   ]
          //  )
         
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
    