import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "canceled", "refunded", "failed"],
      required: true,
      default: "pending",
    },
    embededInfo: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    zaloTransactionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);
