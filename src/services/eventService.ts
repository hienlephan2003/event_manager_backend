import Event from "../models/Event";
import ShowTime from "../models/ShowTime";
// export type IEvent = {
//     eventId: string;
//     eventName: string;
// }
const eventService = {
  createNewEvent: (event: Object) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newEvent = new Event(event);
        const saveEvent: any = await newEvent.save();
        resolve(saveEvent._doc);
      } catch (e) {
        reject(e);
      }
    });
  },
  updateEvent: (eventId: String, event: Object) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updateEvent = await ShowTime.findByIdAndUpdate(
          eventId,
          {
            $set: event,
          },
          { new: true }
        );
        // const { __v, createdAt, updatedAt, ...others} = updateEvent._doc;
        // resolve(others);
      } catch (e) {
        reject(e);
      }
    });
  },
  getListEvent: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const allEvent = await Event.find({})
          .limit(10)
          .sort({ startAt: 1 })
          .exec();
        resolve(allEvent);
      } catch (e) {
        reject(e);
      }
    });
  },
};

export default eventService;
