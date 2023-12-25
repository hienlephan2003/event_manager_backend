import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    showTime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShowTime",
      required: true,
    },
    totalPrice: { type: Number, required: true },
    tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TicketSale",
      },
    ],
    ticketNames: [
      {
        type: String,
      },
    ],
    discount: [
      {
        type: String,
      },
    ],
    receiverName: { type: String },
    receiverEmail: { type: String },
    receiverPhoneNumber: { type: String },
    status: {
      type: String,
      enum: ["success", "pending", "failed", "cancel"],
      default: "pending",
    },
    bookingToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
