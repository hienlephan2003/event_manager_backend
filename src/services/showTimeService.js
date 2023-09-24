const ShowTime = require("../models/ShowTime");

exports.createNewShowTime = (eventId, startAt, endAt, address) => {
    return new Promise(async (resolve, reject) => {
        try{
            const newShowTime = new ShowTime({eventId, startAt, endAt, address });
            const saveShowTime = await newShowTime.save();
            const { __v, createdAt, updatedAt, ...newShowTimeInfo } = saveShowTime._doc;
            resolve(newShowTimeInfo);
        }
        catch(e){
            reject(e);
        }
    })
}