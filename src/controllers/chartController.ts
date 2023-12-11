import {
  SeatsioClient,
  Region,
  CreateEventParams,
  ChartListParams,
} from "seatsio";
import { Request, Response } from "express";
export const client = new SeatsioClient(
  Region.OC(),
  "03ead987-6752-49ab-8cf9-a97064b40388"
);
const chartController = {
  createNewChart: async (req: Request, res: Response) => {
    try {
      const chartKey = req.body.chartKey;
      console.log("chart key receive to publish draft" + chartKey);

      let result: any = await client.charts.create(chartKey as string);
      return res.status(200).json(result);
    } catch (e: any) {
      console.log("error when publish draft " + JSON.stringify(e));
      if (e?.status == 400) {
        return res.status(400).json(e?.errors?.[0]);
      }
      return res.status(500).json(e);
    }
  },
  addCategories: async (req: Request, res: Response) => {
    try {
      const chartKey = req.body.chartKey;
      console.log("chart key receive to publish draft" + chartKey);
      const categoryToAdd = {
        key: "112",
        label: "Category 2",
        color: "#bbbbbb",
        accessible: true,
      };
      let status = await client.charts.addCategory(chartKey, categoryToAdd);
      console.log(status.data);
      return res.status(200).json("ee");
    } catch (e: any) {
      console.log(e);
      // console.log("error when add categories draft " + JSON.stringify(e));
      // if (e?.status == 400) {
      //   return res.status(400).json(e?.errors?.[0]);
      // }
      return res.status(500).json(e);
    }
  },
  validateChart: async (req: Request, res: Response) => {
    try {
      const chartKey = req.body.chartKey;
      console.log("chart key receive to validate draft" + chartKey);
      let value = await client.charts.validatePublishedVersion(
        chartKey as string
      );
      console.log(JSON.stringify(value));
      return res.status(200).json(value);
    } catch (e: any) {
      console.log("error when validate draft " + JSON.stringify(e));
      if (e?.status) {
        return res.status(e.status).json(e.errors?.[0]);
      }
      return res.status(500).json(e);
    }
  },
  addNewEvent: async (req: Request, res: Response) => {
    try {
      const chartKey = req.body.chartKey;
      console.log("chart key receive to publish draft" + chartKey);
      let status = await client.events.create(chartKey);
      res.status(200).json(status);
    } catch (e: any) {
      if (e?.status) {
        return res.status(e.status).json(e.messages?.[0]);
      }
      return res.status(500).json(e);
    }
  },
  getAllChart: async (req: Request, res: Response) => {
    try {
      let params = new ChartListParams().withExpandEvents(false);
      const listChart = await client.charts.listFirstPage(params);
      res.status(200).json(listChart);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getCategories: async (req: Request, res: Response) => {
    try {
      const chartKey = req.body.chartKey;
      console.log(chartKey);
      const listChart = await client.charts.listCategories(chartKey);
      console.log("get cate" + JSON.stringify(listChart));
      res.status(200).json(listChart);
    } catch (err) {
      console.log(err);
      return res.status(500).json("hheeh");
    }
  },
};

export default chartController;
