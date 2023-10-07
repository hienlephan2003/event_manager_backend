import express from "express";
const router = express.Router();
import ticketController from "../controllers/ticketController";
const {verifyToken} = require("../middlewares/verifyToken")
router.get("/event", ticketController.getTicketTypesOfEvent);  
// CREATE TICKET 
router.post("/sale", verifyToken ,ticketController.createTicketSales);

router.post("/type", verifyToken, ticketController.createTicketTypes);
//UPDATE TICKET
router.put("/type/:id", verifyToken ,ticketController.updateTicketType);
//DELETE TICKET
router.put("/sale/:id", verifyToken , ticketController.updateTicketSale);
//GET TICKET BY ID



module.exports = router