import mongoose from "mongoose";

// export interface IEvent {
//     eventName: string;
//     eventType: string;
//     organizerId?: mongoose.Schema.Types.ObjectId;
//     coverImage: string;
//     description:String;
//     status: string;
//     embeddedLinks:Array<string>;
//     startTime: Date;
//     stageId: mongoose.Schema.Types.ObjectId;

//   }

const EventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventType: [
      {
        type: String,
        required: true,
      },
    ],
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
    coverImage: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: ["upcomming", "", "canceled", "occurred"],
      default: "upcomming",
    },
    embeddedLinks: [{ type: String }],
    stageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage",
      required: true,
    },
    moderators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
        role: { type: String, required: true },
      },
    ],
  },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true }, // So `console.log()` and other functions that use `toObject()` include virtuals
    timestamps: true,
  }
);
EventSchema.virtual("showtimes", {
  ref: "ShowTime",
  localField: "_id",
  foreignField: "eventId",
});
const Event = mongoose.model("Event", EventSchema);

export default Event;
