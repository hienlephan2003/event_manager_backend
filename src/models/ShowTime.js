const mongoose = require("mongoose");
const Address = require("./Address")
const ShowTimeSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Event",
        required: true
    },
    startAt: {type: Date, required: true,},
    endAt: {type: Date, required: true},
    stageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stage",
        required: true,
    },
    stageState: {
        type: [[]],
        require: true,
    }
}, {
    timestamps: true}
);

module.exports = mongoose.model("ShowTime", ShowTimeSchema);
