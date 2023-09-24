const ShowTime = require("../models/ShowTime");

exports.createNewShowTimes = (showTimes) => {
    return new Promise(async (resolve, reject) => {
        try{
            const showTimesInfo = [];
            const showTimesId = [];
            showTimes.forEach(async (showTime) => {
                const newShowTime = new ShowTime(showTime);
                const saveShowTime = await newShowTime.save();
                const { __v, createdAt, updatedAt, ...newShowTimeInfo } = saveShowTime._doc;
                showTimesId.push(newShowTimeInfo._id)
                showTimesInfo.push(newShowTimeInfo)
            });
            resolve({showTimesInfo, showTimesId});
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
