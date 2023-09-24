const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema({
    stageId: {
        type: String,
        ref: "Stage",
        required: true,  
    },
    xPos: {type: Number, required: true},
    yPos: {type: Number, required: true},
}, {timestamps: true}
);

module.exports = mongoose.model("Seat", SeatSchema);
