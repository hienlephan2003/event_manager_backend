import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, unique: true },
    role: {
        type: String,
        enum: ['admin', 'user', 'officer'],
        required: true
    }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
