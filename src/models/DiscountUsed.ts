import mongoose, { mongo } from "mongoose";

const DiscountUsedSchema = new mongoose.Schema(
  {
    discountId: {
      type: mongoose.Types.ObjectId,
      ref: "Discount",
      required: true,
    },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    timeCount: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("DiscountUsed", DiscountUsedSchema);
