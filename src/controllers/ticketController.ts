import TicketType from "../models/TicketType";
import { Request, Response } from "express";
import Event from "../models/Event";
import ShowTime from "../models/ShowTime";
import ticketService from "../services/ticketService";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import TicketSale from "../models/TicketSale";
const ticketController = {
  // createTicketSales: async (req: Request, res: Response) => {
  //   try {
  //     const newTicket = await ticketService.createTicketSales(
  //       req.body.ticketSales
  //     );
  //     res.status(200).json(newTicket);
  //   } catch (e) {
  //     res.status(500).json(e);
  //   }
  // },
  createTicketTypes: async (req: Request, res: Response) => {
    try {
      const newTicketTypes = await ticketService.createTicketTypes(
        req.body.ticketTypes,
        req.body.eventId
      );
      res.status(200).json(newTicketTypes);
    } catch (e) {
      res.status(500).json(e);
    }
  },
  updateTicketSale: async (req: Request, res: Response) => {
    try {
      // const updateTicket = await ticketService.updateTicketType(req.body);
      // res.status(200).json(updateTicket);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteTicket: async (req: Request, res: Response) => {
    try {
      // await Ticket.findByIdAndDelete(req.params.id)
      res.status(200).json("Ticket successfully deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getTicketById: async (req: Request, res: Response) => {
    try {
      // const ticket = await Ticket.findById(req.params.id)
      // res.status(200).json(ticket)
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getTicketTypesOfEvent: async (req: Request, res: Response) => {
    try {
      const eventId: String = req.query.event_id as String;
      // const doc = await Event.findById(eventId).populate("showtimes");
      // const event: any = doc;
      // const listShowtime = event.showtimes.map(
      //   (showtime: { _id: any }) => showtime._id
      // );
      const listTickets = await TicketType.find({eventId: eventId});
      res.status(200).json(listTickets);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getTicketTypesOfShowtime: async (req: Request, res: Response) => {
    try {
      const showtimeId: String = req.query.showtime_id as String;
      const showtime: any = await ShowTime.findById(showtimeId);
      console.log(showtime);
      const eventId = showtime.eventId;
      const doc1 = await TicketType.find({ eventId: eventId });
      return res.status(200).json(doc1);
      // const doc = await TicketType.find({ showtimeId: showtimeId });
      // res.status(200).json(doc);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //get ticket of ticket type
  getSummaryType: async (req: Request, res: Response) => {
    try {
      const showtimeId: any = req.query.showtime_id;
      const eventId: any = req.query.event_id;
      // const doc = await TicketSale.find({ticketTypeId: typeId});
      const doc = await TicketType.aggregate([
        {
          $match: {
            eventId: new mongoose.Types.ObjectId(eventId),
          },
        },
        {
          $lookup: {
            from: "ticketsales",
            localField: "_id",
            foreignField: "ticketTypeId",
            as: "ticketsales",
          },
        },
        {
          $project: {
            ticketName: 1,
            countTicket: { $size: "$ticketsales" },
            price: 1,
            ticketsales: 1,
          },
        },
        {
          $project: {
            ticketName: 1,
            countTicket: 1,
            price: 1,
            totalPrice: { $multiply: ["$countTicket", "$price"] },
            ticketsales: 1,
          },
        },
      ]);
      res.status(200).json(doc);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  filterTicket: async (req: Request, res: Response) => {
    const showtimeId = req.params.showtimeId;

    const type = req.query.type;
    const sort = req.query.sort;
    console.log(type, sort);
    let timeSort = -1;
    switch (sort) {
      case "Newest":
        timeSort = -1;
        break;
      case "Oldest":
        timeSort = 1;
        break;
    }
    const tickets = await TicketSale.aggregate([
      {
        $set: {
          type: type,
          timeSort: timeSort,
        },
      },
      {
        $match: {
          showTimeId: new mongoose.Types.ObjectId(showtimeId),
        },
      },
      {
        $lookup: {
          from: "tickettypes",
          localField: "ticketTypeId",
          foreignField: "_id",
          as: "ticketType",
        },
      },
      {
        $unwind: {
          path: "$ticketType",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            {
              type: "All",
              "ticketType.ticketName": {
                $ne: "",
              },
            },
            {
              "ticketType.ticketName": type,
            },
          ],
        },
      },
      {
        $group: {
          _id: "$user",
          countTicket: {
            $count: {},
          },
          totalPrice: {
            $sum: "$ticketType.price",
          },
          createdAt: {
            $min: "$createdAt",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          createdAt: timeSort === 1 ? 1 : -1,
        },
      },
    ]);
    res.json(tickets);
  },
};
export default ticketController;
