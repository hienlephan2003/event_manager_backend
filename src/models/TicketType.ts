import mongoose from "mongoose";
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

export default mongoose.model("TicketType", TicketTypeSchema);
