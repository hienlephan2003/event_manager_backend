// import { Request, Response } from 'express';

// let gfs: any;
// let storage: any;

// const initializeGFSandStorage = () => {
//   conn.once('open', () => {
//     // Initialize stream
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection('uploads');
//   });

//   storage = new GridFsStorage({
//     url: process.env.MONGO_URL,
//     file: (req: any, file: any) => {
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err: any, buf: any) => {
//           if (err) {
//             return reject(err);
//           }
//           const filename = buf.toString('hex') + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'uploads',
//           };
//           resolve(fileInfo);
//         });
//       });
//     },
//   });
// };

// const fileController = {
//   initialize: initializeGFSandStorage,

//   getFileList: async (req: Request, res: Response) => {
//     try {
//       gfs.files.find().toArray((err: any, files: any) => {
//         if (!files || files.length === 0) {
//           return res.status(200).json({ files: false });
//         } else {
//           files.map((file: any) => {
//             file.isImage = file.contentType === 'image/jpeg' || file.contentType === 'image/png';
//           });
//           return res.status(200).json({ files: files });
//         }
//       });
//     } catch (err) {
//       return res.status(500).json(err);
//     }
//   },
//   upLoadFile: async (req: Request, res: Response) => {
//     try {
//     } catch (err) {
//       return res.status(500).json(err);
//     }
//   },

//   // Other controller methods...
// };

// export { fileController };
