import TicketSale from "../models/TicketSale";
import TicketType from "../models/TicketType";
exports.createTicketSales = (ticketSales:any) =>{
    return new Promise(async (resolve, reject) => {
        try{
            const ticketTypesInfo = [];
            for (const ticketSale of ticketSales) {
                const newTicketSale = new TicketSale(ticketSale);
                const saveTicket = await newTicketSale.save(); // Use newTicketType instead of newTicket
        
                // const { __v, createdAt, updatedAt, ...newTicketInfo } = saveTicket._doc;
        
                // ticketTypesInfo.push(newTicketInfo);
              }
          //  resolve(ticketTypesInfo);
        }
        catch(e){
            console.log(e)
            reject(e);
        }
    })
}

exports.createTicketTypes = (ticketTypes:any) =>{
    return new Promise(async (resolve, reject) => {
        try{
            const ticketTypesInfo = [];
            for (const ticketType of ticketTypes) {
                const newTicketType = new TicketType(ticketType);
                const saveTicket = await newTicketType.save(); // Use newTicketType instead of newTicket
        
                // const { __v, createdAt, updatedAt, ...newTicketInfo } = saveTicket._doc;
        
                // ticketTypesInfo.push(newTicketInfo);
              }
          //  resolve(ticketTypesInfo);
        }
        catch(e){
            reject(e);
        }
    })
}
exports.updateTicketType = (ticketTypeId:any, ticketPayload:any) => {
    return new Promise(async (resolve, reject) => {
        try{
            const updateTicketType = await TicketType.findByIdAndUpdate(
                ticketTypeId, {
                    $set: ticketPayload,
                }, {new: true}
            )
            // const { __v, createdAt, updatedAt, ...others} = updateTicketType._doc;       
            // resolve(others);
        }
        catch(e){
            reject(e);
        }
    })
}
exports.updateTicketType = (ticketSaleId:any, ticketPayload:any) => {
    return new Promise(async (resolve, reject) => {
        try{
            const updateTicketSale = await TicketSale.findByIdAndUpdate(
                ticketSaleId, {
                    $set: ticketPayload,
                }, {new: true}
            )
            // const { __v, createdAt, updatedAt, ...others} = updateTicketSale._doc;       
            // resolve(others);
        }
        catch(e){
            reject(e);
        }
    })
}


exports.getListTicketsOfEvent = (eventId:any) => {
    return new Promise(async (resolve, reject) => {
        try{
            // const allTicket = await Ticket.find({
            //     eventId: eventId
            // })
            // .exec();     
            // resolve(allTicket);
        }
        catch(e){
            reject(e);
        }
    })
}
