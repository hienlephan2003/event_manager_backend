const ShowTime = require("../models/ShowTime");
const Stage = require("../models/Stage")
exports.createNewShowTimes = (data) => {
    return new Promise(async (resolve, reject) => {
        try{
            const showTimesInfo = [];
            const stage = await Stage.findById(data.stageId);
            if(!stage){
                throw 'Stage is not exists'
            }
            const stageModel = stage.stageModel;
            for(const showTime of data.showTimes){
                showTime.eventId = data.eventId;
                showTime.stageId = data.stageId;
                showTime.stageState = stageModel;
                const newShowTime = new ShowTime(showTime);
                const saveShowTime = await newShowTime.save();
                const { __v, createdAt, updatedAt, ...newShowTimeInfo } = saveShowTime._doc;
                showTimesInfo.push(newShowTimeInfo)
            }
            resolve(showTimesInfo);
        }
        catch(e){
            reject(e);
        }
    })
}
exports.updateShowTime = (showTimeId, showTime) => {
    return new Promise(async (resolve, reject) => {
        try{
            const updateShowTime = await ShowTime.findByIdAndUpdate(
                showTimeId, {
                    $set: showTime,
                }, {new: true}
            )
            const { __v, createdAt, updatedAt, ...others} = updateShowTime._doc;       
            resolve(others);
        }
        catch(e){
            reject(e);
        }
    })
}
exports.getListShowTimesOfEvent = (eventId) => {
    return new Promise(async (resolve, reject) => {
        try{
            const allShowTime = await ShowTime.find({
                eventId: eventId
            })
            .exec();     
            resolve(allShowTime);
        }
        catch(e){
            reject(e);
        }
    })
}
