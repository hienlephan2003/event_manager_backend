import { Request, Response } from "express";
import { client } from "./chartController";
import bookingService from "../services/bookingService";
import { PaymentDTO } from "../types/payment.type";
import paymentService from "../services/paymentService";
import discountService from "../services/discountService";
import Booking from "../models/Booking";
import Payment from "../models/Payment";
import ticketService from "../services/ticketService";
import { Types } from "mongoose";
import { logger } from "../utils/logger";
import showtimeService from "../services/showTimeService";
type NewBookingRequest = {
  eventId: string;
  userId: string;
  objects: any;
};
const bookingController = {
  getHoldToken: async (req: Request, res: Response) => {
    try {
      const holdToken = await bookingService.findHoldToken(
        req.body.user.id,
        req.body.eventKey
      );
      console.log("get hold token" + JSON.stringify(holdToken));
      res.status(200).json(holdToken);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  bookingTicketsDemo: async (req: Request, res: Response) => {
    try {
      const data = {
        seats: req.body.seats,
        eventKey: req.body.eventKey,
        holdToken: req.body.holdToken,
      };
      console.log(data.seats);
      // const bookingResult = await client.events.book(data.eventKey, data.seats);

      const bookingResult = await bookingService.createPermanentBooking(
        data.seats,
        data.eventKey,
        data.holdToken
      );
      res.status(200).json(bookingResult);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  newHoldTickets: async (req: Request, res: Response) => {
    // const newBookingRequest : NewBookingRequest = {
    //     eventId: req.body?.eventId || "" ,
    //     userId: req.user.id || "",
    //     objects: req.body.objects
    // }
    try {
      console.log("tui la booking event ne");
      console.log(JSON.stringify(req.body));
      const eventKey = req.body.eventKey;
      const holdToken = req.body.holdToken;
      const seats = req.body.tickets.flatMap((item: any) => item.seats);
      console.log(seats, eventKey);
      // const result = await client.events.hold(
      //   eventKey,
      //   req.body.tickets[0].seats,
      //   holdToken
      // );
      // console.log(result);
      return res.status(200).json("result");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  createNewBooking: async (req: Request, res: Response) => {
    try {
      let totalPrice = 0;
      const tickets = req.body.tickets;
      tickets.map((ticket: any) => {
        totalPrice += ticket.count * ticket.price;
      });
      const data = {
        userId: req.body.user.id,
        showTime: req.body.showtime,
        totalPrice,
        tickets: req.body.tickets,
        discount: req.body.discounts,
        receiverName: req.body.receiverName,
        receiverEmail: req.body.receiverEmail,
        receiverPhoneNumber: req.body.receiverPhoneNumber,
        bookingToken: req.body.holdToken?.holdToken,
      };
      console.log("tui la create new booking ne");

      // console.log(data);
      await Promise.all(
        data.discount?.map(async (item: any) => {
          const result = await discountService.applyDiscount(
            item._id,
            data.userId,
            item.maxtimeUsed
          );
          console.log(result);
          if (result == true) {
            let value = totalPrice * item.percent;
            if (value > item.maxAmount) value = item.maxAmount;
            totalPrice -= value;
          }
        })
      );
      if (totalPrice < 0) totalPrice = 0;
      const newBooking = new Booking({
        userId: data.userId,
        showTime: data.showTime,
        totalPrice: data.totalPrice,
        receiverEmail: data.receiverEmail,
        receiverName: data.receiverName,
        receiverPhoneNumber: data.receiverPhoneNumber,
        status: totalPrice == 0 ? "success" : "pending",
        bookingToken: data.bookingToken,
      });
      console.log("created booking" + newBooking._id);
      const ticketSaleIds = await ticketService.createTicketSales(
        data.tickets,
        data.userId,
        newBooking._id,
        data.showTime
      );
      newBooking.tickets = ticketSaleIds as [Types.ObjectId];
      //create permanent booking

      client.holdTokens;
      const eventKeyId: any = await showtimeService.getEventKeyOfShowtime(
        data.showTime
      );
      // console.log("get event key id" + eventKeyId);
      const seatNames: any = await bookingService.getSeatNamesByBookingId(
        newBooking._id
      );
      await client.events.hold(eventKeyId, seatNames, data.bookingToken);
      // await bookingService.createPermanentBooking(
      //   seatNames,
      //   eventKeyId,
      //   data.bookingToken
      // );

      newBooking.save();
      console.log("created tickets");
      const doc: any = newBooking;
      //create payment
      const payment: PaymentDTO = {
        userId: doc.userId,
        bookingId: doc._id,
        amount: totalPrice < 50000 ? 50000 : totalPrice,
        embededInfo: "",
      };
      paymentService.createTransaction(payment).then(async (data) => {
        console.log("create transaction success");
        console.log(data);
        return res.status(200).json(data);
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  getBookingResult: async (req: Request, res: Response) => {},
  deleteBooking: async (req: Request, res: Response) => {
    try {
      await bookingService.deleteBooking(req.body.bookingId);
      res.status(200).json("success");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  cancelBooking: async (req: Request, res: Response) => {
    try {
      await bookingService.cancelBooking(req.params.id);
      res.status(200).json("success");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

export default bookingController;
