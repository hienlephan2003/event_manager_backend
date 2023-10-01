import eventService from "../services/eventService"
import Event from "../models/Event";
import { Request, Response } from "express"
import organizerService from "../services/organizerService";
import showTimeService from "../services/showTimeService";
import addressService from "../services/addressService";

const eventController = {
    createEvent: async (req:Request, res:Response) =>{
        try{
            const event = req.body;
            //const user = req.user;
            //create new organizer if not exist
            if(!event.organizerId || !event.organizerId.trim()){
                if(!event.organizer){
                    throw "You need to add organizer infomation"
                }
                const organizer = event.organizer;
               // organizer.managedBy = user.id;
                const newOrganizer:any = await organizerService.createNewOrganizer(organizer);
                console.log(newOrganizer);
                event.organizerId = newOrganizer._id
            }
            if(!event.addressId || !event.addressId.trim()){
                if(!event.address){
                    throw 'You need to add event address infomation'
                }
                const address:any = await addressService.createNewAddress(event.address);
                event.addressId = address._id;
            }
            const newEvent = await eventService.createNewEvent(event)
            res.status(200).json(newEvent)
        }
        catch(e){
            console.log(e)
            res.status(500).json(e)
        }
    },
    updateEvent: async (req:Request, res:Response) => {
        try{
            const updateEvent = await eventService.updateEvent(req.body.id, req.body.event);
            res.status(200).json(updateEvent);
        }
        catch(err) {
            res.status(500).json(err)
        }
    },
    deleteEvent: async(req:Request, res:Response) =>{
        try{
            await Event.findByIdAndDelete(req.params.id)
            res.status(200).json("Event successfully deleted")
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getEvent: async (req:Request, res:Response) =>{
        try{
       const event:any = await Event.findById(req.params.id);
       const time = event.startTime;
       const months = {
                    1: 'January',
                    2: 'February',
                    3: 'March',
                    4: 'April',
                    5: 'May',
                    6: 'June',
                    7: 'July',
                    8: 'August',
                    9: 'September',
                    10: 'October',
                    11: 'November',
                    12: 'December',
                };
                const days = {
                    0: 'Sunday',
                    1: 'Monday',
                    2: 'Tuesday',
                    3: 'Wednesday',
                    4: 'Thursday',
                    5: 'Friday',
                    6: 'Saturday',
                };
                //let binh = `${days[time.getDay()]}, ${time.getDate()} ${months[time.getMonth()]} ${time.getFullYear()} (${time.getHours()}:${time.getMinutes()})`;
                
            // console.log(req.params.id)
           
        //    let binh = await Event.find({}).aggregate([
        //         {"%w,%d %B %y (%H:%M)"
        //             $dateToString: {format: "%d/%m/%y", date: '$startTime'}
        //         }
        //     ])
            
            res.status(200).json(event)
        }
        catch(err){
            
            res.status(500).json(err)
        }
    },
    getAllEvents: async (req:Request, res:Response) =>{
        try{
            const listEvent = await eventService.getListEvent()
            res.status(200).json(listEvent)                      
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getAllShowTimesOfEvent: async (req:Request, res:Response) =>{
        try{
            const listShowTimes = await showTimeService.getListShowTimesOfEvent(req.params.id)
            res.status(200).json(listShowTimes)                      
        }
        catch(err){
            res.status(500).json(err)
        }
    },
}
export default eventController