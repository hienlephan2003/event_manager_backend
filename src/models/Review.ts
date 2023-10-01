import mongoose from "mongoose";


const ReviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    detailReview: {type: String, required: true},
    rate: Number,
    reviewImage: String,
}, {timestamps: true}
);

export default mongoose.model("Review", ReviewSchema);
