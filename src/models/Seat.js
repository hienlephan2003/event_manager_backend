const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema({
    xPos: {type: Number, required: true},
    yPos: {type: Number, required: true},
}, {timestamps: true}
);

module.exports = mongoose.model("Seat", SeatSchema);
