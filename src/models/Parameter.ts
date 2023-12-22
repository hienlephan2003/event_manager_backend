import mongoose from "mongoose";

const ParameterSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);
export default mongoose.model("Parameter", ParameterSchema);
