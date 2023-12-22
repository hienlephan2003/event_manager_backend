import { Request, Response } from "express";
import Parameter from "../models/Parameter";

const parameterController = {
  getCommission: async (req: Request, res: Response) => {
    const result = await Parameter.findOne({ name: "commission" });
    return res.json(result?.value);
  },
  create: async (req: Request, res: Response) => {
    const parameter = new Parameter(req.body);
    const result = await parameter.save();
    res.status(200).json({
      success: true,
      Message: "create successfully",
    });
  },
};
export default parameterController;
