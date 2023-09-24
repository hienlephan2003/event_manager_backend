const eventService = require("../services/eventService")
const organizerService = require("../services/organizerService")
const addressService = require("../services/addressService")
const showTimeService = require("../services/showTimeService")
module.exports = {
    createEvent: async (req, res) =>{
        try{
            const event = req.body;
            const user = req.user;
            //create new organizer if not exist
            if(!event.organizerId || !event.organizerId.trim()){
                if(!event.organizer){
                    throw "You need to add organizer infomation"
                }
                const organizer = event.organizer;
                organizer.managedBy = user.id;
                const newOrganizer = await organizerService.createNewOrganizer(organizer);
                console.log(newOrganizer);
                event.organizerId = newOrganizer._id
            }
            if(!event.addressId || !event.addressId.trim()){
                if(!event.address){
                    throw 'You need to add event address infomation'
                }
                const address = await addressService.createNewAddress(event.address);
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
    updateEvent: async (req, res) => {
        try{
            const updateEvent = await eventService.updateEvent(req.body);
            res.status(200).json(updateEvent);
        }
        catch(err) {
            res.status(500).json(err)
        }
    },
    deleteEvent: async(req, res) =>{
        try{
            await Event.findByIdAndDelete(req.params.id)
            res.status(200).json("Event successfully deleted")
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getEvent: async (req, res) =>{
        try{
            const event = await Event.findById(req.params.id)
            res.status(200).json(event)
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getAllEvents: async (req, res) =>{
        try{
            const listEvent = await eventService.getListEvent()
            res.status(200).json(allEvent)                      
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getAllShowTimesOfEvent: async (req, res) =>{
        try{
            const listShowTimes = await showTimeService.getListShowTimesOfEvent(req.params.id)
            res.status(200).json(listShowTimes)                      
        }
        catch(err){
            res.status(500).json(err)
        }
    },
}