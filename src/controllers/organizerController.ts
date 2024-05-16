import organizerService from "../services/organizerService";
import Organizer from "../models/Organizer";
import { Request, Response } from "express";

const organizerController = {
  createOrganizer: async (req: Request, res: Response) => {
    try {
      const organizerManager = req.body.user.id;
      const newOrganizer = await organizerService.createNewOrganizer(
        req.body,
        organizerManager
      );
      res.status(200).json(newOrganizer);
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  },
  updateOrganizer: async (req: Request, res: Response) => {
    try {
      const updateOrganizer = await organizerService.updateOrganizer(req.body);
      res.status(200).json(updateOrganizer);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteOrganizer: async (req: Request, res: Response) => {
    try {
      await Organizer.findByIdAndDelete(req.params.id);
      res.status(200).json("Organizer successfully deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getOrganizer: async (req: Request, res: Response) => {
    try {
      const organizer = await Organizer.findOne({
        managedBy: req.body.user.id,
      }).populate("address");
      res.status(200).json(organizer);
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
export default organizerController;
