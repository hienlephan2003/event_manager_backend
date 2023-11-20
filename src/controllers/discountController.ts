import organizerService from "../services/organizerService";
import Organizer from "../models/Organizer";
import { Request, Response } from "express";
import Discount from "../models/Discount";
import { ObjectId } from "mongodb";
const discountController = {
  create: async (req: Request, res: Response) => {
    try {
      const discount = new Discount({
        code: req.body.code,
        amount: req.body.amount,
        quantity: req.body.quantity,
        startAt: new Date(req.body.startAt),
        endAt: new Date(req.body.endAt),
        showtimeId: new ObjectId(req.body.showtimeId),
      });
      const result = await discount.save();
      res.status(200).json({
        success: true,
        Message: "add successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const listDiscount = await Discount.find({
        showtimeId: req.query.showtime_id,
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
      const discount = await Discount.findOneAndUpdate({ _id: req.params.id }, req.body);
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
};
export default discountController;
