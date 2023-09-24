const mongoose = require("mongoose");
const Seat = require("./Seat")
const ShowTicketSchema = new mongoose.Schema({
    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"ShowTime",
        required: true
    },
    seat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
        required: true
    },
    status: {
        type: String,
        enum: ['reserved', 'available'],
        required: true
    }
}, {timestamps: true}
);

module.exports = mongoose.model("ShowTicket", ShowTicketSchema);
