import TicketType from "../models/TicketType";
const ticketService = {
  createTicketTypes: (ticketTypes: any, eventId: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        ticketTypes.forEach((ticketType: any) => {
          ticketType.eventId = eventId;
        });
        const newTickets = await TicketType.insertMany(ticketTypes);
        resolve(newTickets);
      } catch (e) {
        reject(e);
      }
    });
  },
  updateTicketType: (ticketTypeId: any, ticketPayload: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updateTicketType = await TicketType.findByIdAndUpdate(
          ticketTypeId,
          {
            $set: ticketPayload,
          },
          { new: true }
        );
        // const { __v, createdAt, updatedAt, ...others} = updateTicketType._doc;
        // resolve(others);
      } catch (e) {
        reject(e);
      }
    });
  },
  getTicketTypesOfEvent: (listShowtime: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const currentDate = new Date();
        console.log(listShowtime);
        const allTicketTypes = await TicketType.find({
          showtimeId: listShowtime,
          startSale: { $lte: currentDate },
        }).exec();
        resolve(allTicketTypes);
      } catch (e) {
        reject(e);
      }
    });
  },
};
export default ticketService;
