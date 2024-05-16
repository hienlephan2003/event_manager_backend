import TicketType from "../models/TicketType";
import { Request, Response } from "express";
import Event from "../models/Event";
import ShowTime from "../models/ShowTime";
import ticketService from "../services/ticketService";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import TicketSale from "../models/TicketSale";
import axios from "axios";
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
import * as mailgen from "mailgen";
import { User } from "../models/User";
const sendEmail = require("../utils/sendEmail");
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
  getAllTickets: async (req:Request, res: Response) => {
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
      // const doc = await Event.findById(eventId).populate("showtimes");
      // const event: any = doc;
      // const listShowtime = event.showtimes.map(
      //   (showtime: { _id: any }) => showtime._id
      // );
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

      const doc = await TicketSale.aggregate([
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
          from: "bookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "booking",
        },
      },
      {
        $unwind: {
          path: "$booking",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return res.json(result);
  },
  generatePdf: async (req: Request, res: Response) => {
    const ticketIds = req.query.ids;
    const email = req.query.email;
    // const user: any = await User.findById(userId);
    // const email = user.email;
    let tickets: any[];
    let attachs: any[] = [];
    if (!Array.isArray(ticketIds)) {
      tickets = [ticketIds];
    } else tickets = ticketIds;

    const ticketDatas: any = await TicketSale.find({
      _id: {
        $in: tickets,
      },
    }).populate([
      {
        path: "ticketTypeId",
      },
      {
        path: "showTimeId",
        populate: {
          path: "eventId",
        },
      },
    ]);
    let i = 0;
    while (i < ticketDatas.length) {
      const ticketData = ticketDatas[0];
      const eventId = ticketData?.showTimeId.eventId._id;
      const eventData = axios.get(
        `${process.env.BASE_URL}api/event/detail/${eventId}`
      );
      const detailEvent = (await eventData).data;
      const doc = new PDFDocument();
      const fontPath = path.resolve(
        __dirname,
        "../fonts/Montserrat-Medium.ttf"
      );
      doc.pipe(fs.createWriteStream(`ticket${tickets[i]}.pdf`));
      let qr = await QRCode.toDataURL(tickets[i]);
      doc.rect(10, 10, doc.page.width - 20, 240).stroke();
      doc
        .font(fontPath)
        .fontSize(20)
        .text(ticketData?.showTimeId.eventId.eventName, 20, 50);
      doc.fontSize(16).text("Location: " + detailEvent.address, 20, 100);
      doc.fontSize(16).text("Time: " + detailEvent.startTime, 20, 120);
      doc.fontSize(16).image(qr, 480, 50, { width: 100 });
      doc
        .fontSize(16)
        .text("Type: " + ticketData.ticketTypeId.ticketTypeName, 20, 140);
      doc.end();
      const attach = path.resolve(__dirname, `../../ticket${tickets[i]}.pdf`);
      let temp = {
        filename: `ticket${tickets[i]}.pdf`, 
        path: attach, 
        contentType: "application/pdf",
      };
      attachs.push(temp);
      i++;
    }
    try {
      await sendEmail(email, "Your ticket", "Your ticket", attachs);
      res.json("send email successfully");
    } catch (err) {
      throw err;
    }
  },
};
export default ticketController;
