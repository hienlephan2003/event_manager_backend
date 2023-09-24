const eventService = require("../services/eventService")
module.exports = {
    createEvent: async (req, res) =>{
        try{
            const newEvent = await eventService.createNewEvent(req.body)
            res.status(200).json(newEvent)
        }
        catch(e){
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
    }
}