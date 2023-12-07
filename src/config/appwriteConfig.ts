type IAppWriteConfig = {
  projectId: string;
  storageId: string;
  url: string;
  secretKey: string;
};
export const appWriteConfig: IAppWriteConfig = {
  url: process.env.APPWRITE_URL || "",
  projectId: process.env.APPRITE_PROJECT_ID || "",
  storageId: process.env.APPRITE_STORAGE_ID || "",
  secretKey: process.env.APPRITE_SECRECT_KEY || "",
};
