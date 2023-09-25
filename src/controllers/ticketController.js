const ticketService = require("../services/ticketService")
const TicketSale = require("../models/TicketSale")
const TicketType = require("../models/TicketType")
module.exports = {
    createTicketSales: async (req, res) =>{
        try{
            const newTicket = await ticketService.createTicketSales(req.body.ticketSales);
            res.status(200).json(newTicket)
        }
        catch(e){
            res.status(500).json(e)
        }
    },
    createTicketTypes: async (req, res) =>{
        try{
            const newTicketTypes = await ticketService.createTicketTypes(req.body.ticketTypes)
            res.status(200).json(newTicketTypes);
        }
        catch(e){
            res.status(500).json(e)
        }
    },
    updateTicketType: async (req, res) => {
        try{
            const updateTicket = await ticketService.updateTicketType(req.body);
            res.status(200).json(updateTicket);
        }
        catch(err) {
            res.status(500).json(err)
        }
    },
    updateTicketSale: async (req, res) => {
        try{
            const updateTicket = await ticketService.updateTicketSale(req.body);
            res.status(200).json(updateTicket);
        }
        catch(err) {
            res.status(500).json(err)
        }
    },

    deleteTicket: async(req, res) =>{
        try{
            await Ticket.findByIdAndDelete(req.params.id)
            res.status(200).json("Ticket successfully deleted")
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getTicketById: async (req, res) =>{
        try{
            const ticket = await Ticket.findById(req.params.id)
            res.status(200).json(ticket)
        }
        catch(err){
            res.status(500).json(err)
        }
    },
    getAllTicketsOfOrganizer: async (req, res) =>{
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