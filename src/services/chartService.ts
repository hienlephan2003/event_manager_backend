import { client } from "../controllers/chartController";

const chartService = {
  createShowtimeStage: (chartKey: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("chart key" + chartKey);
        const showtimeStage = await client.events.create(chartKey);
        console.log("showtime" + JSON.stringify(showtimeStage));
        resolve(showtimeStage);
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },
};
export default chartService;
