import { Request, Response } from "express";
import { client } from "./chartController";
import bookingService from "../services/bookingService";
import { PaymentDTO } from "../types/payment.type";
import paymentService from "../services/paymentService";
import discountService from "../services/discountService";
import Booking from "../models/Booking";
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
      const eventKey = req.body.eventKey;
      const holdToken = req.body.holdToken;
      const discountId = req.body.discountId;

      console.log(req.body);
      // const seats = req.body.tickets.flatMap((item: any) => item.seats);
      let totalPrice = 0;
      const tickets = req.body.tickets;
      tickets.map((ticket: any) => {
        totalPrice += ticket.count * ticket.price;
      });
      const ticketSeats = tickets.flatMap((item: any) => item.seats);
      //create booking
      const data = {
        userId: req.body.user.id,
        showTime: req.body.showtime,
        totalPrice,
        tickets: req.body.tickets,
        discount: [],
        receiverName: req.body.receiverName,
        receiverEmail: req.body.receiverEmail,
        receiverPhoneNumber: req.body.receiverPhoneNumber,
      };
      console.log("tui la create new booking ne");
      console.log(data);
      const newBooking = new Booking({
        userId: data.userId,
        showTime: data.showTime,
        totalPrice: data.totalPrice,
        tickets: ticketSeats,
        receiverEmail: data.receiverEmail,
        receiverName: data.receiverName,
        receiverPhoneNumber: data.receiverPhoneNumber,
        discount: data.discount,
        status: totalPrice == 0 ? "success" : "pending",
      });
      newBooking.save();
      // if (totalPrice == 0) {
      //   return res.status(200).json("booking success");
      // }
      const doc: any = newBooking;
      //create payment
      const payment: PaymentDTO = {
        userId: doc.userId,
        bookingId: doc._id,
        amount: totalPrice < 50000 ? 50000 : totalPrice,
        embededInfo: req.body.embededInfo ?? "",
        redirectUrl: "http://localhost:3000/events/65105f66641996e970f130a0/",
      };
      paymentService.createTransaction(payment).then((data) => {
        console.log(data);
        return res.status(200).json(data);
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

export default bookingController;
