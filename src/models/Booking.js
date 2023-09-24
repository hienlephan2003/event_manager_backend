const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Organizer",
        required: true
    },
    showTime: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"ShowTime",
        required: true
    },
    totalPrice: {type: Number, required: true,},
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShowTicket"    
    }]
}, {timestamps: true}
);

module.exports = mongoose.model("Booking", BookingSchema);
