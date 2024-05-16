import mongoose, { mongo } from "mongoose";

const DiscountSchema = new mongoose.Schema(
  {
    discountName: { type: String, required: true },
    description: { type: String, required: true },
    percent: { type: Number, required: true },
    maxAmount: { type: Number },
    minOrderAmount: { type: Number },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    quantity: { type: Number, required: true },
    maxtimeUsed: { type: Number, default: 1 },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketTypes: { type: mongoose.Schema.Types.ObjectId, ref: "TicketType" },
  },
  { timestamps: true }
);

export default mongoose.model("Discount", DiscountSchema);
