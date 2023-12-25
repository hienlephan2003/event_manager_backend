import eventService from "../services/eventService";
import Event from "../models/Event";
import { Request, Response } from "express";
import showTimeService, { IShowTime } from "../services/showTimeService";
import { ObjectId } from "mongodb";
import ticketService from "../services/ticketService";
import mongoose from "mongoose";
import showtimeService from "../services/showTimeService";
import stageService from "../services/stageService";
import { Region, SeatsioClient } from "seatsio";
import TicketSale from "../models/TicketSale";
// import { IEvent } from "./../models/Event";

const eventController = {
  createEvent: async (req: Request, res: Response) => {
    try {
      const event = {
        chartId: req.body.chartId,
        organizerId: "65105f66641996e970f1309c",
        eventName: req.body.eventName,
        description: req.body.description,
        coverImage: req.body.coverImage,
        eventType: req.body.eventTypes,
        tickets: req.body.tickets,
        showtimes: req.body.showtimes,
        address: req.body.address,
        stageId: null,
      };
      console.log(req.body);
      let stage;
      if (event.chartId) {
        stage = await stageService.createNewStage(
          event.chartId,
          event.address,
          event.organizerId
        );
        event.stageId = (stage as any)._id;
      }
      console.log(stage);
      const newEvent: any = await eventService.createNewEvent(event);
      console.log(newEvent);
      const tickets = await ticketService.createTicketTypes(
        event.tickets,
        newEvent._id
      );
      console.log(tickets);
      const showtimes = await showtimeService.createNewShowTimes(
        event.showtimes,
        newEvent._id,
        event.chartId
      );
      console.log(showtimes);
      res.status(200).json({ event: newEvent, showtimes, tickets, stage });
      console.log("tui la create new event ne");
    } catch (e) {
      console.log("e " + e);
      res.status(500).json(e);
    }
  },
  updateEvent: async (req: Request, res: Response) => {
    try {
      const updateEvent = await eventService.updateEvent(
        req.body.id,
        req.body.event
      );
      res.status(200).json(updateEvent);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteEvent: async (req: Request, res: Response) => {
    try {
      // await Event.deleteMany({
      //   chartId: "12",
      // });
      await Event.findByIdAndDelete(req.params.id);
      res.status(200).json("Event successfully deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getDetailEvent: async (req: Request, res: Response) => {
    try {
      const doc = await Event.findById(req.params.id).populate([
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
      // console.log(doc);
      //create new organizer if not exist
      // if (!event.organizerId || !event.organizerId.trim()) {
      //   if (!event.organizer) {
      //     throw "You need to add organizer infomation";
      //   }
      //   const organizer = event.organizer;
      //   // organizer.managedBy = user.id;
      //   const newOrganizer: any = await organizerService.createNewOrganizer(
      //     organizer
      //   );
      //   console.log(newOrganizer);
      //   event.organizerId = newOrganizer._id;
      // }

      // const eventDoc = await Event.aggregate(
      //   [
      //     {
      //       $match:{
      //         id: req.params.id
      //       }
      //     },
      //     {
      //       $lookup: {
      //         from: "stages",
      //         localField: "stageId",
      //         foreignField: "_id",
      //         as: "stage"
      //       }
      //     },
      //     {
      //       $unwind: {
      //         path: "$stage",
      //         preserveNullAndEmptyArrays: true
      //       }
      //     },
      //     {
      //       $lookup: {
      //         from: "addresses",
      //         localField: "stage.addressId",
      //         foreignField: "_id",
      //         as: "address"
      //       }
      //     },
      //     {
      //       $unwind: {
      //         path: "$address",
      //         preserveNullAndEmptyArrays: true
      //       }
      //     },
      //     {
      //       $lookup: {
      //         from: "organizers",
      //         localField: "organizerId",
      //         foreignField: "_id",
      //         as: "organizer"
      //       }
      //     },
      //     {
      //       $unwind: {
      //         path: "$organizer",
      //         preserveNullAndEmptyArrays: true
      //       }
      //     },
      //     {
      //       $lookup: {
      //         from: "showtimes",
      //         localField: "_id",
      //         foreignField: "eventId",
      //         as: "showtimes",
      //       },
      //     },

      //     {
      //       $project: {
      //         _id: 1,
      //         eventName: 1,
      //         coverImage:1,
      //         showtimes: 1,
      //         address: 1,
      //         stage:1,
      //         organizer:1,
      //       },
      //     },
      //   ]
      //  )
      //res.status(200).json(eventDoc)
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const eventDoc: any = doc;
      const stage: any = eventDoc.stageId;
      const organizer: any = eventDoc.organizerId;
      const time: any = eventDoc.showtimes[0].startAt;
      const address = stage.addressId;
      const event: any = { ...eventDoc };

      const ev = event._doc;
      ev.showtimes = eventDoc.showtimes;
      ev.hours = ("0" + time.getHours()).slice(-2);
      ev.minutes = ("0" + time.getMinutes()).slice(-2);
      ev.month = months[time.getMonth()];
      ev.year = time.getFullYear();
      ev.day = days[time.getDay()];
      ev.date = time.getDate();
      ev.startTime = `${ev.day}, ${ev.date} ${ev.month} ${ev.year} (${ev.hours}:${ev.minutes})`;
      const data = {
        address: `${address.ward}, ${address.district}, ${address.province}`,
        stage: stage.stageName,
        organizer: organizer,
        eventType: eventDoc.eventType,

        ...ev,
      };
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  getAllEvents: async (req: Request, res: Response) => {
    try {
      // let client = new SeatsioClient(Region.OC(), 'ce25e325-9589-4562-9c5c-08f64b152d6b');
      // await client.events.book('b4eecd68-248b-4a5b-808c-1da15468515a', ['G-5','G-6']);
      const listEvent = await Event.aggregate([
        {
          $match: {
            status: "Approved",
          },
        },
        {
          $lookup: {
            from: "showtimes",
            localField: "_id",
            foreignField: "eventId",
            as: "showtimes",
          },
        },
        {
          $lookup: {
            from: "stages",
            localField: "stageId",
            foreignField: "_id",
            as: "stage",
          },
        },
        {
          $unwind: {
            path: "$stage",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "addresses",
            localField: "stage.addressId",
            foreignField: "_id",
            as: "address",
          },
        },
        {
          $unwind: {
            path: "$address",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "tickettypes",
            localField: "_id",
            foreignField: "eventId",
            as: "ticketTypes",
          },
        },
      ]);
      res.status(200).json(listEvent);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllShowTimesOfEvent: async (req: Request, res: Response) => {
    try {
      const listShowTimes = await showTimeService.getListShowTimesOfEvent(
        req.params.id
      );
      res.status(200).json(listShowTimes);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getEventById: async (req: Request, res: Response) => {
    try {
      const event = await Event.findOne({
        _id: req.params.id,
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
        "moderators.user",
      ]);
      res.status(200).json(event);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  searchEvent: async (req: Request, res: Response) => {
    try {
      const query = req.query;
      const str: string = query.q as string;
      console.log(str);
      const regex = new RegExp(str, "i");
      //const listResults = await Event.find({eventName: {$regex: regex}}).populate({path:'stageId'})
      const listResults = await Event.aggregate([
        {
          $match: { eventName: { $regex: regex }, status: "Approved" },
        },
        {
          $lookup: {
            from: "stages",
            localField: "stageId",
            foreignField: "_id",
            as: "stage",
          },
        },
        {
          $unwind: {
            path: "$stage",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "addresses",
            localField: "stage.addressId",
            foreignField: "_id",
            as: "address",
          },
        },
        {
          $unwind: {
            path: "$address",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "showtimes",
            localField: "_id",
            foreignField: "eventId",
            as: "showtimes",
          },
        },
        {
          $limit: 6,
        },
      ]);

      res.status(200).json(listResults);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  filterEvent: async (req: Request, res: Response) => {
    const provinceRes = req.query.address;
    const startTime = req.query.start as string;
    const endTime = req.query.end as string;
    const priceQuery = req.query.price || "both";
    const type = req.query.types as string[];
    const query = "" || (req.query.query as string);
    const regex = new RegExp(query, "i");

    let typeRes: string[];
    if (type === undefined) typeRes = [];
    else if (!Array.isArray(type)) typeRes = [type];
    else typeRes = type;
    console.log(typeRes);
    const listEvent = await Event.aggregate([
      {
        $set: {
          endTime: endTime,
          priceQuery: priceQuery,
          types: typeRes,
          provinceRes: provinceRes,
        },
      },
      {
        $match: {
          status: "Approved",
        },
      },
      {
        $lookup: {
          from: "stages",
          localField: "stageId",
          foreignField: "_id",
          as: "stage",
        },
      },
      {
        $unwind: {
          path: "$stage",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "stage.addressId",
          foreignField: "_id",
          as: "address",
        },
      },
      {
        $unwind: {
          path: "$address",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            {
              provinceRes: null,
              "address.province": {
                $ne: "",
              },
            },
            {
              provinceRes: "Other locations",
              "address.province": {
                $nin: ["Ho Chi Minh", "Ha Noi"],
              },
            },
            {
              "address.province": provinceRes,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "showtimes",
          localField: "_id",
          foreignField: "eventId",
          as: "showtimes",
        },
      },

      {
        $match: {
          $or: [
            {
              endTime: undefined,
              "showtimes.startAt": {
                $gte: new Date(startTime),
              },
            },
            {
              "showtimes.startAt": {
                $gte: new Date(startTime),
                $lt: new Date(endTime),
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "tickettypes",
          localField: "_id",
          foreignField: "eventId",
          as: "ticketTypes",
        },
      },
      {
        $match: {
          $or: [
            {
              priceQuery: "Free",
              "ticketTypes.ticketTypePrice": 0,
            },
            {
              priceQuery: "Paid",
              "ticketTypes.ticketTypePrice": {
                $gt: 0,
              },
            },
            {
              priceQuery: "both",
              "ticketTypes.ticketTypePrice": {
                $gte: 0,
              },
            },
          ],
        },
      },

      {
        $match: {
          $or: [
            {
              types: [],
              eventType: {
                $nin: typeRes,
              },
            },
            {
              eventType: {
                $in: typeRes,
              },
            },
          ],
        },
      },
      {
        $match: { eventName: { $regex: regex } },
      },
    ]);

    res.json(listEvent);
  },
  createModerator: async (req: Request, res: Response) => {
    try {
      const event = await Event.findById(req.params.event_id).populate(
        "moderators"
      );
      const userId = req.body.userId as string;
      const userObj = new ObjectId(userId);
      if (event !== null) {
        const listModerator = event.moderators as any[];
        await event.updateOne({
          moderators: [
            ...listModerator,
            {
              user: userObj,
              role: req.body.role,
            },
          ],
        });
        res.status(200).json(event);
      } else res.status(404).json();
    } catch (e) {
      res.status(500).json(e);
    }
  },
  recommendedEvent: async (req: Request, res: Response) => {
    const result = await Event.aggregate([
      {
        $match: {
          status: "Approved",
        },
      },
      {
        $lookup: {
          from: "showtimes",
          localField: "_id",
          foreignField: "eventId",
          as: "showtimes",
        },
      },
      {
        $match: {
          'showtimes.startAt': {
            $gte: new Date()
          }
        }
      },
      {
        $lookup: {
          from: "tickettypes",
          localField: "_id",
          foreignField: "eventId",
          as: "ticketTypes",
        },
      },
      {
        $lookup: {
          from: "ticketsales",
          localField: "ticketTypes._id",
          foreignField: "ticketTypeId",
          as: "tickets",
        },
      },
      {
        $set: {
          count: {
            $size: "$tickets",
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },

      {
        $limit: 5,
      },
    ]);
    res.json(result);
  },
  suggestEvent: async (req: Request, res: Response) => {
    const types = req.query.types as string[];
    console.log(types);
    let typeRes: string[];
    if (!Array.isArray(types)) typeRes = [types];
    else typeRes = types;
    //console.log(typeRes);
    const result = await Event.aggregate([
      {
        $set: {
          types: typeRes,
        },
      },
      {
        $match: {
          status: "Approved",
        },
      },
      {
        $match: {
          eventType: {
            $in: typeRes,
          },
        },
      },
      {
        $lookup: {
          from: "stages",
          localField: "stageId",
          foreignField: "_id",
          as: "stage",
        },
      },
      {
        $unwind: {
          path: "$stage",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "stage.addressId",
          foreignField: "_id",
          as: "address",
        },
      },
      {
        $unwind: {
          path: "$address",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "showtimes",
          localField: "_id",
          foreignField: "eventId",
          as: "showtimes",
        },
      },
      {
        $lookup: {
          from: "tickettypes",
          localField: "_id",
          foreignField: "eventId",
          as: "ticketTypes",
        },
      },
      {
        $match: {
          "showtimes.startAt": {
            $gt: new Date(),
          },
        },
      },
    ]);
    res.json(result);
  },
  pendingEvent: async (req: Request, res: Response) => {
    const result = await Event.find({
      status: {
        $in: ["Approved", "Pending", "Canceled"],
      },
    }).populate("organizerId");
    return res.status(200).json(result);
  },
  approveEvent: async (req: Request, res: Response) => {
    const result = await Event.findByIdAndUpdate(req.params.id, {
      status: "Approved",
    });
    return res.status(200).json(result);
  },
  rejectEvent: async (req: Request, res: Response) => {
    const result = await Event.findByIdAndUpdate(req.params.id, {
      status: "Rejected",
    });
    return res.status(200).json(result);
  },
  topHotEvents: async (req: Request, res: Response) => {
    const endDate = new Date();
    let startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    console.log(endDate, startDate);
    const result = await Event.aggregate([
      {
        $lookup: {
          from: "tickettypes",
          localField: "_id",
          foreignField: "eventId",
          as: "ticketTypes",
        },
      },
      {
        $lookup: {
          from: "ticketsales",
          localField: "ticketTypes._id",
          foreignField: "ticketTypeId",
          as: "tickets",
        },
      },
      {
        $match: {
          "tickets.createdAt": {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $unwind: {
          path: "$tickets",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$tickets.seats",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            id: "$_id",
            name: "$eventName",
          },

          countSeats: {
            $count: {},
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },

      {
        $limit: 5,
      },
    ]);
    return res.json(result);
  },
};
export default eventController;
