import { InferSchemaType, Schema, Types } from "mongoose";
import mongoose from "mongoose";
export interface IStage {
    organizerId: Types.ObjectId,
stageName: string,
seatNumber: Number,
heightDimension: Number,
widthDimension: Number,
stageModel: Number[][],
ticketMap: Map<Types.ObjectId,Types.ObjectId>,
addressId: Types.ObjectId,
}
const StageSchema = new mongoose.Schema({
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Organizer",
        required: true
    },
    stageName: {type: String, required: true},
    seatNumber: {type: Number, required: true},
    heightDimension: {type: Number, required: true},
    widthDimension: {type: Number, required: true},
    stageModel: {
        type: [[]],
        require: true,
    },
    ticketMap: {
        type: Map,
        of: {
            type: 'ObjectId',
            ref: "TicketSale"
        },
        require: true,
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Address",
        required: true
    }
}, {timestamps: true}
);
// StageSchema.virtual('seats', {
//     ref: "Seat",
//     localField: "_id",
//     foreignField: "stageId"
// })

export default mongoose.model("Stage", StageSchema);
