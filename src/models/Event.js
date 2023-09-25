const mongoose = require("mongoose")

const EventSchema = new mongoose.Schema({
    eventName: {type: String, required: true},
    eventType: {
        type: String, 
        enum: ['liveMusic', 'theater', 'course', 'sport', 'community','nightlife', 'artculture'],
        required: true},
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Organizer",
        required: true
    },
    coverImage: {type: String},
    description: {type: String},
    status: {
        type: String,
        enum: ['upcomming', '','canceled', 'occurred'],
        default: 'upcomming'
    },
    embeddedLinks : [{type: String}],
    startTime: {type: Date, required: true},
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },
}, {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
    timestamps: true}
);
EventSchema.virtual('showTimes', {
    ref: "ShowTime",
    localField: "_id",
    foreignField: "eventId"
})
module.exports = mongoose.model("Event", EventSchema);
