const Event = require("../models/Event");

exports.createNewEvent = (event) => {
    return new Promise(async (resolve, reject) => {
        try{
            const newEvent = new Event(event);
            const saveEvent = await newEvent.save();
            const { __v, createdAt, updatedAt, ...newEventInfo } = saveEvent._doc;
            resolve(newEventInfo);
        }
        catch(e){
            reject(e);
        }
    })
}
exports.updateEvent = (event) => {
    return new Promise(async (resolve, reject) => {
        try{
            const updateEvent = await Job.findByIdAndUpdate(
                req.params.id, {
                    $set: req.body,
                }, {new: true}
            )
            const { __v, createdAt, updatedAt, ...others} = updateEvent._doc;       
            resolve(others);
        }
        catch(e){
            reject(e);
        }
    })
}
exports.getListEvent = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const allEvent = await Event.find({
                startAt: { $gt: Date.now()}
            })
            .limit(10)
            .sort({startAt: 1})
            .exec();     
            resolve(allEvent);
        }
        catch(e){
            reject(e);
        }
    })
}
