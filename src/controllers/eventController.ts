import eventService from "../services/eventService";
import Event from "../models/Event";
import { Request, Response } from "express";
import organizerService from "../services/organizerService";
import showTimeService from "../services/showTimeService";
import addressService from "../services/addressService";
import {
  AnyObject,
  HydratedDocument,
  IndexDefinition,
  Model,
  Types,
} from "mongoose";
import Stage from "../models/Stage";
import TicketType from "../models/TicketType";
import User from "../models/User";
import { ObjectId } from "mongodb";

// import { IEvent } from "./../models/Event";

const eventController = {
  createEvent: async (req: Request, res: Response) => {
    try {
      const event = req.body;
      //create new organizer if not exist
      if (!event.organizerId || !event.organizerId.trim()) {
        if (!event.organizer) {
          throw "You need to add organizer infomation";
        }
        const organizer = event.organizer;
        // organizer.managedBy = user.id;
        const newOrganizer: any = await organizerService.createNewOrganizer(
          organizer
        );
        console.log(newOrganizer);
        event.organizerId = newOrganizer._id;
      }
      if (!event.addressId || !event.addressId.trim()) {
        if (!event.address) {
          throw "You need to add event address infomation";
        }
        const address: any = await addressService.createNewAddress(
          event.address
        );
        event.addressId = address._id;
      }
      const newEvent = await eventService.createNewEvent(event);
      res.status(200).json(newEvent);
    } catch (e) {
      console.log(e);
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

        ...ev,
      };
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllEvents: async (req: Request, res: Response) => {
    try {
      const listEvent = await Event.aggregate([
        {
          $lookup: {
            from: "showtimes",
            localField: "_id",
            foreignField: "eventId",
            as: "showtimes",
          },
        },

        {
          $project: {
            _id: 1,
            eventName: 1,
            eventType: 1,
            coverImage: 1,
            showtimes: {
              $map: {
                input: "$showtimes",
                as: "item",
                in: {
                  startAt: {
                    $dateToString: {
                      date: "$$item.startAt",
                      format: "%d/%m/%Y",
                    },
                  },
                },
              },
            },
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
        "moderators.user"
        
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
          $match: { eventName: { $regex: regex } },
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
          $project: {
            _id: 1,
            eventName: 1,
            startTime: {
              $dateToString: { date: "$startTime", format: "%d/%m/%Y" },
            },
            stage: "$stage.stageName",
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
  createModerator: async (req: Request, res: Response) => {
    try {
      const event = await Event.findById(req.params.event_id).populate(
        "moderators"
      );
      const userId = req.body.userId as string;
      const userObj = new ObjectId(userId);
      if (event !== null) {
        const listModerator = event.moderators as any[]
        await event.updateOne({
          moderators: [...listModerator, {
            user: userObj,
            role: req.body.role 
          }],
        });
        res.status(200).json(event);
      } else res.status(404).json();
    } catch (e) {
      res.status(500).json(e);
    }
  },
};
export default eventController;