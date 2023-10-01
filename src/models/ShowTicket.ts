import mongoose from "mongoose";
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
    },
    seatPosition: {
        type: Seat,
        require: true,
    }
}, {timestamps: true}
);

export default mongoose.model("ShowTicket", ShowTicketSchema);
