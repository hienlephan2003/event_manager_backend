import mongoose from "mongoose";


const SeatSchema = new mongoose.Schema({
    xPos: {type: Number, required: true},
    yPos: {type: Number, required: true},
}, {timestamps: true}
);

export default mongoose.model("Seat", SeatSchema);
