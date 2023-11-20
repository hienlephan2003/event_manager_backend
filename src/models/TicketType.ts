import mongoose from "mongoose";
const TicketTypeSchema = new mongoose.Schema({
    showtimeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"ShowTime",
        required: true
    },
    ticketName: {type: String, required: true},
    ticketColor: String,
    ticketImage: String,
    description: String,
    quantity: {type: Number, required: true},
    startSale: {type: Date, required: true},
    endSale: {type: Date, required: true},
    price: {type: Number, required: true},
    discounts: [{type: mongoose.Schema.Types.ObjectId, ref:'Discount'}]
}, {timestamps: true}
);

export default mongoose.model("TicketType", TicketTypeSchema);
