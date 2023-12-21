import { Request, Response } from "express";
import Event from "../models/Event";
const myController = {
  getAllEvents: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const events = await Event.find({
        "moderators.user": {
          $in: [userId],
        },
      }).populate([
        {
          path: "stageId",
          populate: {
            path: "addressId",
          },
        },
        {
          path: "organizerId",
        },
        "showtimes",
      ]);
      res.status(200).json(events);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  searchMyEvent: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const query = req.query;
      const str: string = query.q as string;
      const regex = new RegExp(str, "i");
      const results = await Event.find({
        "moderators.user": {
          $in: [userId],
        },
        eventName: { $regex: regex },
      }).populate([
        {
          path: "stageId",
          populate: {
            path: "addressId",
          },
        },
        {
          path: "organizerId",
        },
        "showtimes",
      ]);

      res.status(200).json(results);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
export default myController;
