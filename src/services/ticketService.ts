import TicketSale from "../models/TicketSale";
import TicketType from "../models/TicketType";
const ticketService = {
  createTicketSales: (ticketSales: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const ticketTypesInfo = [];
        for (const ticketSale of ticketSales) {
          const newTicketSale = new TicketSale(ticketSale);
          const saveTicket: any = await newTicketSale.save(); // Use newTicketType instead of newTicket

          const { __v, createdAt, updatedAt, ...newTicketInfo } =
            saveTicket?._doc;

          ticketTypesInfo.push(newTicketInfo);
        }
        resolve(ticketTypesInfo);
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  },

  createTicketTypes: (ticketTypes: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const ticketTypesInfo = [];
        for (const ticketType of ticketTypes) {
          const newTicketType = new TicketType(ticketType);
          const saveTicket = await newTicketType.save(); // Use newTicketType instead of newTicket

          // const { __v, createdAt, updatedAt, ...newTicketInfo } = saveTicket._doc;

          // ticketTypesInfo.push(newTicketInfo);
        }
        //  resolve(ticketTypesInfo);
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
