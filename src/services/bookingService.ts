import { client } from "../controllers/chartController";
import TicketHoldToken from "../models/TicketHoldToken";

const bookingService = {
  createTemporaryBooking: (seats: Array<string>, eventKey: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const holdToken = await client.holdTokens.create();

        const result = await client.events.hold(
          eventKey,
          seats,
          holdToken.holdToken
        );
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  },
  createPermanentBooking: (
    seats: Array<string>,
    eventKey: string,
    holdToken: string
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await client.events.hold(eventKey, seats, holdToken);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  },
  releaseBooking: (
    seats: Array<string>,
    eventKey: string,
    holdToken?: string
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await client.events.release(seats, eventKey, holdToken);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  },
  findHoldToken: (userId: string, eventKey: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await TicketHoldToken.findOne({
          userId,
          eventKey,
        });
        if (token) {
          const tockenDoc = (token as any)._doc;
          if (tockenDoc.expiresAt > new Date()) {
            console.log("this 1");
            resolve({ ...tockenDoc, session: "continue" });
          } else {
            console.log("this 2");
            const newholdToken = await client.holdTokens.create();
            token.holdToken = newholdToken.holdToken;
            token.expiresAt = newholdToken.expiresAt;
            token.expiresInSeconds = newholdToken.expiresInSeconds;
            token.save();
            const tokenDoc = (token as any)._doc;
            resolve({ ...tokenDoc, session: "continue" });
          }
        } else {
          const newholdToken = await client.holdTokens.create();
          const newToken = new TicketHoldToken({
            userId,
            eventKey,
            holdToken: newholdToken.holdToken,
            expiresAt: newholdToken.expiresAt,
            expiresInSeconds: newholdToken.expiresInSeconds,
          });
          newToken.save();
          const token: any = (newToken as any)._doc;
          resolve({ ...token, session: "start" });
        }
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },
};
export default bookingService;
