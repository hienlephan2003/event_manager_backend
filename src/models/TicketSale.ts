import mongoose, { mongo } from "mongoose";

const TicketSaleSchema = new mongoose.Schema(
  {
    ticketTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketType",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    showTimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShowTime",
      required: true,
    },
    startSaleAt: {
      type: Date,
      required: false,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seats: [
      {
        type: String,
      },
    ],
    endSaleAt: { type: Date, required: false },
    minPerOrder: { type: Number, required: false, default: 1 },
    maxPerOrder: { type: Number, required: false },
  },
  { timestamps: true }
);

export default mongoose.model("TicketSale", TicketSaleSchema);
