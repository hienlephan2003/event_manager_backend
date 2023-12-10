import mongoose from "mongoose";
const ShowTimeSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    showTimeStage: { type: String, required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    startSaleTicketDate: { type: Date, required: true },
    endSaleTicketDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ShowTime", ShowTimeSchema);
