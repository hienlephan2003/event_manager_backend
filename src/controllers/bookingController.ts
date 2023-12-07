import { Request, Response } from "express";
import { client } from "./chartController";
import bookingService from "../services/bookingService";
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
      const result = await client.events.hold(
        eventKey,
        req.body.tickets[0].seats,
        holdToken
      );
      console.log(result);
      return res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  newPayTickets: async (req: Request, res: Response) => {
    try {
      const eventKey = req.body.eventKey;
      const holdToken = req.body.holdToken;
      const seats = req.body.tickets.flatMap((item: any) => item.seats);
      console.log(seats, eventKey);

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
