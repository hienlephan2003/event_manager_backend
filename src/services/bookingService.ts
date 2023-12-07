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
        const token = await TicketHoldToken.findOne({ userId, eventKey });
        if (token) {
          if (token.expiresAt > new Date()) {
            resolve({ ...token, session: "continue" });
          } else {
            const newholdToken = await client.holdTokens.create();
            token.holdToken = newholdToken.holdToken;
            token.expiresAt = newholdToken.expiresAt;
            token.expiresInSeconds = newholdToken.expiresInSeconds;
            token.save();
            resolve({ ...token, session: "continue" });
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
          resolve({ ...newToken, session: "start" });
        }
      } catch (err) {
        reject(err);
      }
    });
  },
};
export default bookingService;
