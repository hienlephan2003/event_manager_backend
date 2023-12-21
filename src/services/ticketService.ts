import TicketSale from "../models/TicketSale";
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
  getTickets: (eventId: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        const currentDate = new Date();
        const allTicketTypes = await TicketType.find({
          eventId: eventId,
        }).exec();
        resolve(allTicketTypes);
      } catch (e) {
        reject(e);
      }
    });
  },
  createTicketSales: (
    tickets: any,
    userId: any,
    bookingId: any,
    showtime: any
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("tickets");
        console.log(tickets);
        let ticketSales: any = [];
        tickets.map((ticket: any) => {
          if (ticket.seats.length > 0) {
            const ticketSale = new TicketSale({
              seats: ticket.seats,
              user: userId,
              bookingId,
              ticketTypeId: ticket.ticketTypeId,
              showTimeId: showtime,
            });
            ticketSale.save();
            ticketSales.push(ticketSale._id);
          }
        });
        resolve(ticketSales);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },
  getTicketsByBookingId: (bookingId: any) => {
    return new Promise(async (res, rej) => {
      try {
        const tickets = await TicketSale.find({
          bookingId: bookingId,
        }).populate("ticketTypeId");
        res(tickets);
      } catch (err) {
        rej(err);
      }
    });
  },
};
export default ticketService;
