import mongoose from "mongoose";
import { client } from "../controllers/chartController";
import Booking from "../models/Booking";
import Payment from "../models/Payment";
import TicketHoldToken from "../models/TicketHoldToken";
import TicketSale from "../models/TicketSale";
import paymentService from "./paymentService";
import showtimeService from "./showTimeService";
import ticketService from "./ticketService";

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
        // if (token) {
        //   const tockenDoc = (token as any)._doc;
        //   if (tockenDoc.expiresAt > new Date()) {
        //     console.log("this 1");
        //     resolve({ ...tockenDoc, session: "continue" });
        //   } else {
        //     console.log("this 2");
        //     const newholdToken = await client.holdTokens.create();
        //     token.holdToken = newholdToken.holdToken;
        //     token.expiresAt = newholdToken.expiresAt;
        //     token.expiresInSeconds = newholdToken.expiresInSeconds;
        //     token.save();
        //     const tokenDoc = (token as any)._doc;
        //     resolve({ ...tokenDoc, session: "continue" });
        //   }
        // }
        //  else {
        const newholdToken = await client.holdTokens.create();
        console.log(newholdToken);
        const newToken = new TicketHoldToken({
          userId,
          eventKey,
          holdToken: newholdToken.holdToken,
          expiresAt: newholdToken.expiresAt,
          expiresInSeconds: newholdToken.expiresInSeconds,
        });
        newToken.save();
        const tokenDoc: any = (newToken as any)._doc;
        resolve({ ...tokenDoc, session: "start" });
        // }
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
  cancelBooking: async (bookingId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const booking = await Booking.findById(bookingId);
        if (!booking) reject("Not found booking");
        else {
          new Promise(async (res, rej) => {
            if (booking.totalPrice > 0) {
              paymentService
                .createPaymentRefund(bookingId)
                .then((data) => res(data))
                .catch((err) => rej(err));
            }
          })
            .then(async (data) => {
              const showtimeId: any = booking.showTime;
              const eventKey = await showtimeService.getEventKeyOfShowtime(
                showtimeId
              );
              const seats = await ticketService.getTicketNamesByBookingId(
                bookingId
              );
              await client.events
                .release(eventKey as string, seats as string[])
                .then((data) => {
                  console.log(data);
                  booking.status = "cancel";
                  booking.save();
                  resolve(booking);
                });
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        }
      } catch (err) {
        reject(err);
      }
    });
  },
};
export default bookingService;
