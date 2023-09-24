const mongoose = require("mongoose")

const VoucherSchema = new mongoose.Schema({
    name: {type: String, required: true},
    discountPercent: {type: Number, required: true},
    maxDiscount: {type: Number, required: true},
    expiredDate: {type: Date, required: true},
}, {timestamps: true}
);

module.exports = mongoose.model("Voucher", VoucherSchema);
