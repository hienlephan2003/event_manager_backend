import mongoose from "mongoose";
const AddressSchema = new mongoose.Schema({
    province: {type: String, required: true},
    district: {type: String, required: true},
    ward: {type: String, required: true}
}, {timestamps: true}
);

export default mongoose.model("Address", AddressSchema);
