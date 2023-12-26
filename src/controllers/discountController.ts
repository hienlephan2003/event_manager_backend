import organizerService from "../services/organizerService";
import Organizer from "../models/Organizer";
import { Request, Response } from "express";
import Discount from "../models/Discount";
import { ObjectId } from "mongodb";
import { TrustProductsEntityAssignmentsContextImpl } from "twilio/lib/rest/trusthub/v1/trustProducts/trustProductsEntityAssignments";
import discountService from "../services/discountService";
import DiscountUsed from "../models/DiscountUsed";
const discountController = {
  create: async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const discount = await Discount.create(req.body);
      res.status(200).json(discount);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const listDiscount = await Discount.find({
        eventId: req.query.event_id,
      });
      res.status(200).json(listDiscount);
    } catch (e) {
      res.status(500).json(e);
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const data = await Discount.findById(req.params.id);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      await Discount.findOneAndDelete({ _id: req.params.id });
      res.status(200).json("discount successfully deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      console.log(req.params.id, req.body);
      const discount = await Discount.findOneAndUpdate(
        { _id: req.params.id },
        req.body
      );
      res.status(200).json({
        message: "success",
        data: discount,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAllOrganizers: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const listOrganizer = await organizerService.getListOrganizer(userId);
      res.status(200).json(listOrganizer);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  checkDiscount: async (req: Request, res: Response) => {
    try {
      const data = {
        code: req.body.discountCode,
        showtimeId: req.body.showtimeId,
        userId: req.body.user.id,
      };
      const result = await discountService.checkDiscountValid(
        data.code,
        data.showtimeId,
        data.userId
      );
      console.log(result);
      if (result == true) {
        return res.status(200).json("valid discount");
      } else return res.status(400).json("invalid discount");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  getDiscountsOfEvent: async (req: Request, res: Response) => {
    try {
      const eventId = req.params.id;
      const discounts = await Discount.find({ eventId })
        .where("startAt")
        .lt(Date.now())
        .where("endAt")
        .gt(Date.now())
        .populate("ticketTypes");

      const validDiscounts = await Promise.all(
        discounts.map(async (item: any) => {
          const discountUsed = await DiscountUsed.findOne({
            discountId: item._id,
            userId: req.body.user.id,
          });
          console.log(discountUsed);
          if (!discountUsed || discountUsed.timeCount < item.maxtimeUsed) {
            return item;
          } else return null;
        })
      );
      console.log(validDiscounts);
      const filteredDiscounts = validDiscounts.filter((item) => item !== null);

      res.status(200).json(filteredDiscounts);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  findAll: async (req: Request, res: Response) => {
    const result = await Discount.find({});
    return res.json(result);
  },
};
export default discountController;
