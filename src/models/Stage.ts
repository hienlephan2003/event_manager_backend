import { Types } from "mongoose";
import mongoose from "mongoose";
const StageSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
    chartId: { type: String },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Stage", StageSchema);
