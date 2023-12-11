import mongoose from "mongoose";
const TicketTypeSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketTypeName: { type: String, required: true },
    ticketColor: String,
    ticketImage: String,
    ticketInfomation: String,
    minPerOrder: { type: Number, required: false, default: 1 },
    maxPerOrder: { type: Number, required: false },
    ticketTypePrice: { type: Number, required: true },
    discounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discount" }],
  },
  { timestamps: true }
);

export default mongoose.model("TicketType", TicketTypeSchema);
