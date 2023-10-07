import showtimeService from "../services/showTimeService";
import ShowTime from "../models/ShowTime";
import { Request, Response } from "express"

const showtimeController = {
    createShowTimes: async (req:Request, res:Response) =>{
        try{
            const data = req.body;
            // const newShowTimes = await showtimeService.createNewShowTimes( data )
            // res.status(200).json(newShowTimes)
        }
        catch(e){
            res.status(500).json(e)
        }
    },
    updateShowTime: async (req:Request, res:Response) => {
        try{
            const updateShowTime = await showtimeService.updateShowTime(req.body.id, req.body.time);
            res.status(200).json(updateShowTime);
        }
        catch(err) {
            res.status(500).json(err)
        }
    },
    deleteShowTime: async(req:Request, res:Response) =>{
        try{
            await ShowTime.findByIdAndDelete(req.params.id)
            res.status(200).json("ShowTime successfully deleted")
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getShowTime: async (req:Request, res:Response) =>{
        try{
            const showTime = await ShowTime.findById(req.params.id)
            res.status(200).json(showTime)
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getAllShowTimesOfEvent: async (req:Request, res:Response) =>{
        try{
            const eventId:String = req.query.event_id as String;
            const listShowTimes = await showtimeService.getListShowTimesOfEvent(eventId);
            res.status(200).json(listShowTimes)                      
        }
        catch(err){
            res.status(500).json(err)
        }
    }
}
export default showtimeController