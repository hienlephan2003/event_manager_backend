const mongoose = require("mongoose")
const StageSchema = new mongoose.Schema({
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Organizer",
        required: true
    },
    stageName: {type: String, required: true},
    seatNumber: {type: Number, required: true},
    heightDimension: {type: Number, required: true},
    widthDimension: {type: Number, required: true},
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
}, {timestamps: true}
);
StageSchema.virtual('seats', {
    ref: "Seat",
    localField: "_id",
    foreignField: "stageId"
})
module.exports = mongoose.model("Stage", StageSchema);
