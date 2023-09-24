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
    showTimes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShowTime",
    }],
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },
}, {timestamps: true}
);

module.exports = mongoose.model("Event", EventSchema);
