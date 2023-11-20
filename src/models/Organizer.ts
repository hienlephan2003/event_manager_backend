import mongoose from "mongoose";
const OrganizerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    organizerName: { type: String, required: true },
    logoImage: {
      type: String,
      default: "",
    },
    description: String,
    phoneNumber: { type: String, required: true },
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  },
  { timestamps: true }
);

export default mongoose.model("Organizer", OrganizerSchema);
