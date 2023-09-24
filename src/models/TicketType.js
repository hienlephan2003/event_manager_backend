const mongoose = require("mongoose")

const TicketTypeSchema = new mongoose.Schema({
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Organizer",
        required: true
    },
    ticketName: {type: Number, required: true},
    seatType: {type: String,
        enum: ['vip', 'premium', 'standard'],
        required: true},
    ticketColor: String,
    ticketImage: String,
    description: String,
    price: {type: Number, required: true}
}, {timestamps: true}
);

module.exports = mongoose.model("TicketType", TicketTypeSchema);
