import mongoose from "mongoose";


const TicketSaleSchema = new mongoose.Schema({
    ticketTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"TicketType",
        required: true
    },
    showTimeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"ShowTime",
        required: true
    },
    startSaleAt: {
        type: Date, 
        required: false,
        default: Date.now() 
    },
    endSaleAt: {type: Date, required: false },
    minPerOrder: {type: Number, required: false, default: 1},
    maxPerOrder: {type: Number, required: false},
}, {timestamps: true}
);

export default mongoose.model("TicketSale", TicketSaleSchema);
