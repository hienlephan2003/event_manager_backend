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
exports.updateEvent = (eventId, event) => {
    return new Promise(async (resolve, reject) => {
        try{
            const updateEvent = await ShowTime.findByIdAndUpdate(
                eventId, {
                    $set: event,
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
