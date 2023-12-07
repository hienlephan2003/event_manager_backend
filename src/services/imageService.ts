import { appWriteConfig } from "../config/appwriteConfig";
import {
  ID,
  InputFile,
  Client,
  Storage,
  Role,
  Permission,
} from "node-appwrite";
const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("656b2afd740f329c2f5d")
  .setKey(
    "8e3e329053c224b736a60c9610222aa27cd8aa07bd987c7695a51d5a51fa7da9d709537cf90fde0a142d09e4c6ed83fb28074b62626f43f01a50d4bf84a05821e584bf86c5e5259dc77425fc64c9284a36218ae32f1a0ed0c121c20705fa4b9d59b919f8f366f51bee9a62de54fc7f62fbcbed90e889783bba4860d04c04cef1"
  )
  .setSelfSigned();
const storage = new Storage(client);

export const uploadNewFile = async (file: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uploadFile = await storage.createFile(
        "656b2dfc5d5d7c01094e",
        ID.unique(),
        InputFile.fromBuffer(file.buffer, file.originalname),
        [
          Permission.read(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
        ]
      );
      resolve(uploadFile);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
export const getFile = async (fileId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileUrl = await storage.getFileDownload(
        "656b2dfc5d5d7c01094e",
        fileId
      );
      resolve(fileUrl);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
