import express from "express";
const router = express.Router();
import ticketController from "../controllers/ticketController";
const {verifyToken} = require("../middlewares/verifyToken")
router.get("/:showtimeId/filter", ticketController.filterTicket);
router.get("/event", ticketController.getTicketTypesOfEvent);  
    router.get("/showtime", ticketController.getTicketTypesOfShowtime);  
    //type ticket
router.put("/type/:id", verifyToken ,ticketController.updateTicketSale);
router.get("/summary" ,ticketController.getSummaryType);
router.post("/type", verifyToken, ticketController.createTicketTypes);
    
//ticket sale
router.put("/sale/:id", verifyToken , ticketController.updateTicketSale);
//router.get("/sale/:id" , ticketController.getTicketOfType);

router.post("/sale", verifyToken ,ticketController.createTicketSales);




module.exports = router