import mongoose from "mongoose";


const NotificationSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    type: {
        type: String,
        enum: ['booking', 'payment', 'notification'],
        default: 'notification'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true}
);

export default mongoose.model("Notification", NotificationSchema);