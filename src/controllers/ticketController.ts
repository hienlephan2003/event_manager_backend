const ticketService = require("../services/ticketService")
import TicketType from "../models/TicketType";
import TicketSale from "../models/TicketSale";
import { Request, Response } from "express"
const ticketController = {
    createTicketSales: async (req:Request, res:Response) =>{
        try{
            
            const newTicket = await ticketService.createTicketSales(req.body.ticketSales);
            res.status(200).json(newTicket)
        }
        catch(e){
            res.status(500).json(e)
        }
    },
    createTicketTypes: async (req:Request, res:Response) =>{
        try{
            const newTicketTypes = await ticketService.createTicketTypes(req.body.ticketTypes)
            res.status(200).json(newTicketTypes);
        }
        catch(e){
            res.status(500).json(e)
        }
    },
    updateTicketType: async (req:Request, res:Response) => {
        try{
            const updateTicket = await ticketService.updateTicketType(req.body);
            res.status(200).json(updateTicket);
        }
        catch(err) {
            res.status(500).json(err)
        }
    },
    updateTicketSale: async (req:Request, res:Response) => {
        try{
            const updateTicket = await ticketService.updateTicketSale(req.body);
            res.status(200).json(updateTicket);
        }
        catch(err) {
            res.status(500).json(err)
        }
    },

    deleteTicket: async(req:Request, res:Response) =>{
        try{
            // await Ticket.findByIdAndDelete(req.params.id)
            res.status(200).json("Ticket successfully deleted")
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getTicketById: async (req:Request, res:Response) =>{
        try{
            // const ticket = await Ticket.findById(req.params.id)
            // res.status(200).json(ticket)
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getAllTicketsOfOrganizer: async (req:Request, res:Response) =>{
        try{
            const organizerId = req.params.id;
            const listTickets = await ticketService.getListTicketsOfEvent(organizerId);
            res.status(200).json(listTickets)                      
        }
        catch(err){
            res.status(500).json(err)
        }
    }
}
export default ticketController