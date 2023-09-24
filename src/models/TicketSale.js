const mongoose = requires("mongoose")

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
    startSaleAt: {type: Date, required: false },
    endSaleAt: {type: Date, required: false },
    totalNumber: {type: Number, required: true},
    minPerOrder: {type: Number, required: false, default: 1},
    maxPerOrder: {type: Number, required: false},
}, {timestamps: true}
);

module.exports = mongoose.model("TicketSale", TicketSaleSchema);
