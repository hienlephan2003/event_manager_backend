import { client } from "../controllers/chartController";
import Booking from "../models/Booking";
import Payment from "../models/Payment";
import TicketHoldToken from "../models/TicketHoldToken";
import TicketSale from "../models/TicketSale";

const bookingService = {
  createTemporaryBooking: (seats: Array<string>, eventKey: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const holdToken = await client.holdTokens.create();

        const result = await client.events.hold(
          eventKey,
          seats,
          holdToken.holdToken
        );
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  },
  createPermanentBooking: (
    seats: Array<string>,
    eventKey: string,
    holdToken: string
  ) => {
    console.log("call eeee");
    return new Promise(async (resolve, reject) => {
      try {
        console.log("one short");
        const result = await client.events.book(eventKey, seats);
        console.log(result);
        resolve(result);
        console.log("not kill");
      } catch (err: any) {
        console.log("one kill");
        console.log(err);
        if ((err?.messages[0]).includes("Cannot change status of object")) {
          resolve(err);
        } else reject(err);
      }
    });
  },
  releaseBooking: (
    seats: Array<string>,
    eventKey: string,
    holdToken?: string
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await client.events.release(seats, eventKey, holdToken);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  },
  findHoldToken: (userId: string, eventKey: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await TicketHoldToken.findOne({
          userId,
          eventKey,
        });
        if (token) {
          const tockenDoc = (token as any)._doc;
          if (tockenDoc.expiresAt > new Date()) {
            console.log("this 1");
            resolve({ ...tockenDoc, session: "continue" });
          } else {
            console.log("this 2");
            const newholdToken = await client.holdTokens.create();
            token.holdToken = newholdToken.holdToken;
            token.expiresAt = newholdToken.expiresAt;
            token.expiresInSeconds = newholdToken.expiresInSeconds;
            token.save();
            const tokenDoc = (token as any)._doc;
            resolve({ ...tokenDoc, session: "continue" });
          }
        } else {
          const newholdToken = await client.holdTokens.create();
          const newToken = new TicketHoldToken({
            userId,
            eventKey,
            holdToken: newholdToken.holdToken,
            expiresAt: newholdToken.expiresAt,
            expiresInSeconds: newholdToken.expiresInSeconds,
          });
          newToken.save();
          const token: any = (newToken as any)._doc;
          resolve({ ...token, session: "start" });
        }
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },
  getBookingById: (bookingId: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const booking = await Booking.findById(bookingId).populate({
          path: "showTime",
          populate: {
            path: "eventId",
            model: "Event",
          },
        });

        resolve(booking);
      } catch (err) {
        reject(err);
      }
    });
  },
  getSeatNamesByBookingId: (bookingId: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const tickets = await TicketSale.find({ bookingId: bookingId });
        const ticketNames = tickets.flatMap((ticket) => ticket.seats);
        console.log(ticketNames);
        resolve(ticketNames);
      } catch (err) {
        reject(err);
      }
    });
  },
  deleteBooking: async (bookingId: string) => {
    try {
      await TicketSale.deleteMany({ bookingId: bookingId });
      await Payment.findOneAndDelete({ bookingId });
      await Booking.findByIdAndDelete(bookingId);
    } catch (err) {
      console.log(err);
    }
  },
};
export default bookingService;
