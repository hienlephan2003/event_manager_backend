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
      enum: ["success", "pending", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
