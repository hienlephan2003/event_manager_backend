import ShowTime from "../models/ShowTime";
export type IShowTime = {
  showTimeStartDate: Date;
  showTimeEndDate: Date;
  startSaleTicketDate: Date;
  endSaleTicketDate: Date;
  eventId: string;
};
import chartService from "./chartService";
const showtimeService = {
  createNewShowTimes: (showtimes: any, eventId: string, chartKey: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(showtimes);

        const showTimesInfo: any = [];
        for (const showTime of showtimes) {
          const showtimeStage = await chartService.createShowtimeStage(
            chartKey
          );
          console.log((showtimeStage as any).key);
          console.log(JSON.stringify(showtimeStage));
          const newShowTime = new ShowTime({
            ...showTime,
            eventId,
            showTimeStage: (showtimeStage as any).key,
          });
          const saveShowTime: any = await newShowTime.save();
          const { __v, createdAt, updatedAt, ...newShowTimeInfo } =
            saveShowTime._doc;
          showTimesInfo.push(newShowTimeInfo);
        }
        resolve(showTimesInfo);
      } catch (e) {
        reject(e);
      }
    });
  },
  updateShowTime: (showTimeId: String, showTime: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updateShowTime = await ShowTime.findByIdAndUpdate(
          showTimeId,
          {
            $set: showTime,
          },
          { new: true }
        );
        // const { __v, createdAt, updatedAt, ...others} = updateShowTime._doc;
        // resolve(others);
      } catch (e) {
        reject(e);
      }
    });
  },
  getListShowTimesOfEvent: (eventId: String) => {
    return new Promise(async (resolve, reject) => {
      try {
        const allShowTime = await ShowTime.find({
          eventId: eventId,
        }).exec();
        resolve(allShowTime);
      } catch (e) {
        reject(e);
      }
    });
  },
};

export default showtimeService;
