const showTimeService = require("../services/showTimeService")
const eventService = require("../services/eventService")
const ShowTime = require("../models/ShowTime")
module.exports = {
    createShowTimes: async (req, res) =>{
        try{
            const data = req.body;
            const newShowTimes = await showTimeService.createNewShowTimes( data )
            res.status(200).json(newShowTimes)
        }
        catch(e){
            res.status(500).json(e)
        }
    },
    updateShowTime: async (req, res) => {
        try{
            const updateShowTime = await showTimeService.updateShowTime(req.body);
            res.status(200).json(updateShowTime);
        }
        catch(err) {
            res.status(500).json(err)
        }
    },
    deleteShowTime: async(req, res) =>{
        try{
            await ShowTime.findByIdAndDelete(req.params.id)
            res.status(200).json("ShowTime successfully deleted")
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getShowTime: async (req, res) =>{
        try{
            const showTime = await ShowTime.findById(req.params.id)
            res.status(200).json(showTime)
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getAllShowTimesOfEvent: async (req, res) =>{
        try{
            const eventId = req.params.eventId;
            const listShowTimes = await showTimeService.getListShowTimesOfEvent(eventId);
            res.status(200).json(listShowTimes)                      
        }
        catch(err){
            res.status(500).json(err)
        }
    }
}