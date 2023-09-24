const mongoose = require("mongoose")

const EventSchema = new mongoose.Schema({
    eventName: {type: String, required: true},
    eventType: {
        type: String, 
        enum: ['liveMusic', 'theater', 'course', 'sport', 'community','nightlife'],
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
        default: 'upcoming'
    },
    embeddedLinks : [{type: String}],
    startTime: {type: Date, required: true},
    showTimes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShowTime",
    }]
}, {timestamps: true}
);

module.exports = mongoose.model("Event", EventSchema);
