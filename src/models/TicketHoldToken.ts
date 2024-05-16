import mongoose from "mongoose";

const TicketHoldToken = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventKey: String,
    expiresAt: {
      type: Date,
      required: true,
    },
    expiresInSeconds: Number,
    holdToken: String,
  },
  { timestamps: true }
);

export default mongoose.model("TicketHoldToken", TicketHoldToken);
