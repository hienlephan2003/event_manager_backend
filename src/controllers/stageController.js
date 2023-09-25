const stageService = require("../services/stageService")
const eventService = require("../services/eventService")
const Stage = require("../models/Stage")
module.exports = {
    createStage: async (req, res) =>{
        try{
            const stage = new Stage(req.body)
            const newStage = await stage.save();
            const { __v, createdAt, updatedAt, ...newStageInfo } = newStage._doc;
            res.status(200).json(newStageInfo)
        }
        catch(e){
            res.status(500).json(e)
        }
    },
    updateStage: async (req, res) => {
        try{
            const updateStage = await stageService.updateStage(req.body);
            res.status(200).json(updateStage);
        }
        catch(err) {
            res.status(500).json(err)
        }
    },
    deleteStage: async(req, res) =>{
        try{
            await Stage.findByIdAndDelete(req.params.id)
            res.status(200).json("Stage successfully deleted")
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getStageById: async (req, res) =>{
        try{
            const stage = await Stage.findById(req.params.id)
            res.status(200).json(stage)
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getAllStagesOfOrganizer: async (req, res) =>{
        try{
            const organizerId = req.params.id;
            const listStages = await stageService.getListStagesOfEvent(organizerId);
            res.status(200).json(listStages)                      
        }
        catch(err){
            res.status(500).json(err)
        }
    }
}