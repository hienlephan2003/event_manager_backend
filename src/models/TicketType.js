const mongoose = require("mongoose")

const TicketTypeSchema = new mongoose.Schema({
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Organizer",
        required: true
    },
    ticketName: {type: String, required: true},
    ticketColor: String,
    ticketImage: String,
    description: String,
    price: {type: Number, required: true}
}, {timestamps: true}
);

module.exports = mongoose.model("TicketType", TicketTypeSchema);
