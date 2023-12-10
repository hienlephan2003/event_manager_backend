import mongoose, { mongo } from "mongoose";

const DiscountSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    amount: { type: Number, required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    // types: [{ type: mongoose.Schema.Types.ObjectId , required: true, ref: 'TicketType'}]
    quantity: { type: Number, required: true },
    maxUsed: { type: Number, default: 1 },
    showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: "Showtime" },
  },
  { timestamps: true }
);

export default mongoose.model("Discount", DiscountSchema);
