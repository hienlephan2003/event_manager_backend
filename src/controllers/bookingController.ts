import { Request, Response } from "express";
import { client } from "./chartController";
import bookingService from "../services/bookingService";
import { PaymentDTO } from "../types/payment.type";
import paymentService from "../services/paymentService";
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
      console.log("eventKey");
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

      // const seats = req.body.tickets.flatMap((item: any) => item.seats);
      let totalPrice = 0;
      const tickets = req.body.tickets;
      tickets.map((ticket: any) => {
        totalPrice += ticket.seats * ticket.price;
      });
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
      console.log("create new booking");
      console.log(data);
      //create payment
      const payment: PaymentDTO = {
        userId: req.body.userId ?? "",
        bookingId: req.body.bookingId ?? "",
        amount: req.body.amount ?? 50000,
        embededInfo: req.body.embededInfo ?? "",
        redirectUrl: "http://localhost:3000/events/65105f66641996e970f130a0/",
      };
      paymentService.createTransaction(payment).then((data) => {
        console.log(data);
        // response.status(200).json(data);
      });

      const result = await client.events.hold(
        eventKey,
        req.body.tickets[0].seats,
        holdToken
      );
      return res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

export default bookingController;
