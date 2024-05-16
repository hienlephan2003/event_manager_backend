import { Request, Response } from "express";
import { getFile, uploadNewFile } from "../services/imageService";
const path = require("path");

const fs = require("fs");

const imageController = {
  uploadImage: async (req: Request, res: Response) => {
    try {
      console.log("call upload");
      const data: any = await uploadNewFile(req.file);
      if (!data) throw Error;
      else {
        const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/656b2dfc5d5d7c01094e/files/${data?.$id}/view?project=656b2afd740f329c2f5d&mode=admin`;
        // const fileUrl = await getFile(data?.$id);
        return res.status(200).json({ url: fileUrl });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  getImageUrl: async (req: Request, res: Response) => {
    try {
      const file = await getFile(req.params.id);
      console.log(file);
      return res.status(200).json(file);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

export default imageController;
