import mongoose from "mongoose";
const OrganizerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    organizerName: { type: String, required: true },
    logoImage: {
      type: String,
      default: "",
    },
    taxCode: String,
    description: String,
    phoneNumber: { type: String, required: true },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    location: String,
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    businessType: {
      type: String,
      default: "Organizer",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Organizer", OrganizerSchema);
