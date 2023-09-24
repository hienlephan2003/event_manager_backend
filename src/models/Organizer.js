const mongoose = require("mongoose");

const OrganizerSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    organizerName: {type: String, required: true},
    logoImage: {
        type: String,
        default: ''
    },
    description: String,
    phoneNumber: {type: String, required: true},
    managedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true}
);

module.exports = mongoose.model("Organizer", OrganizerSchema);
