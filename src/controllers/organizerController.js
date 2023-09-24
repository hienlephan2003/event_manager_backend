const organizerService = require("../services/organizerService")
const Organizer = require("../models/Organizer")
module.exports = {
    createOrganizer: async (req, res) =>{
        try{
            const newOrganizer = await organizerService.createNewOrganizer(req.body)
            res.status(200).json(newOrganizer)
        }
        catch(e){
            res.status(500).json(e)
        }
    },
    updateOrganizer: async (req, res) => {
        try{
            const updateOrganizer = await organizerService.updateOrganizer(req.body);
            res.status(200).json(updateOrganizer);
        }
        catch(err) {
            res.status(500).json(err)
        }
    },
    deleteOrganizer: async(req, res) =>{
        try{
            await Organizer.findByIdAndDelete(req.params.id)
            res.status(200).json("Organizer successfully deleted")
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getOrganizer: async (req, res) =>{
        try{
            const organizer = await Organizer.findById(req.params.id)
            res.status(200).json(organizer)
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getAllOrganizers: async (req, res) =>{
        try{
            const userId = req.params.id;
            const listOrganizer = await organizerService.getListOrganizer();
            res.status(200).json(listOrganizer)                      
        }
        catch(err){
            res.status(500).json(err)
        }
    }
}