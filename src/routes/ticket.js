const router = require("express").Router();
const ticketController = require('../controllers/ticketController');
const {verifyToken} = require("../middlewares/verifyToken")

// CREATE TICKET 
router.post("/sale", verifyToken ,ticketController.createTicketSales);

router.post("/type", verifyToken, ticketController.createTicketTypes);
//UPDATE TICKET
router.put("/type/:id", verifyToken ,ticketController.updateTicketType);
//DELETE TICKET
router.put("/sale/:id", verifyToken , ticketController.updateTicketSale);
//GET TICKET BY ID
router.get("/:id" ,ticketController.getAllTicketsOfOrganizer);


module.exports = router