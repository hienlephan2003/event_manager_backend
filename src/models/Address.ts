import mongoose from "mongoose";
const AddressSchema = new mongoose.Schema(
  {
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    provinceCode: { type: Number, required: true },
    districtCode: { type: Number, required: true },
    wardCode: { type: Number, required: true },
    displacePlace: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Address", AddressSchema);
