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
  getAllTickets: async (req: Request, res: Response) => {
    const result = await TicketSale.aggregate([
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
        $unwind: {
          path: "$seats",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return res.json(result);
  },

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
      const listTickets = await TicketType.find({ eventId: eventId });
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
      // const eventId: any = req.query.event_id;
      // const doc = await TicketSale.find({ticketTypeId: typeId});
      const doc = await TicketType.aggregate([
        {
          $match: {
            showtimeId: new mongoose.Types.ObjectId(showtimeId),
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
          $set: {
            countSeats: {
              $size: "$seats",
            },
          },
        },
        {
          $group: {
            _id: "$ticketType",
            dates: {
              $push: "$createdAt",
            },
            seats: {
              $push: "$countSeats",
            },
            countTicket: { $count: {} },
            totalSeats: {
              $sum: "$countSeats",
            },
          },
        },

        {
          $addFields: {
            totalPrice: {
              $multiply: ["$totalSeats", "$_id.ticketTypePrice"],
            },
          },
        },
        // {
        //   $project: {
        //     _id: 1,
        //     countTicket: 1,
        //     totalPrice: ,
        //     ticketsales: 1,
        //   },
        // },
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
              "ticketType.ticketTypeName": {
                $ne: "",
              },
            },
            {
              "ticketType.ticketTypeName": type,
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
            $sum: "$ticketType.ticketTypePrice",
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
  getTicketOfShowtime: async (req: Request, res: Response) => {
    const showtimeId = req.params.showtimeId;
    const result = await TicketSale.aggregate([
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
        $lookup: {
          from: "users",
          localField: "user",
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
    ]);
    return res.json(result);
  },
};
export default ticketController;
