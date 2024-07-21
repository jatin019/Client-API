const express = require("express");
const router = express.Router();
const {insertTicket, getTickets, getTicketById} = require('../model/ticket/Ticket.model')
const {userAuth} = require('../middlewares/auth.middleware')

// Workflow
// - create url endpoints
// - receive new ticket data
// - authorize every request with jwt
// - insert in mongodb
// - retrive all the ticket for the specific user 
// - retrive a ticket from mongodb
// - update message conversation in the ticket database
// - update ticket status 
// - delete ticket from mongodb

router.all("/", (req, res, next) => {
    // res.json({ message: "Return from ticket router" });
    next();
});

// create url endpoints
// create new tickett
router.post("/", userAuth, async(req, res) => {

    try{
            // retrrive new ticket data
    const { sender, subject, message } = req.body;

    const userId = req.user._id;

    

    const ticketObj = {
        clientId: userId,
        subject,
        conversations: [
            {
                sender,
                message,
                
            }
        ]
    }

    const result = await insertTicket(ticketObj);
    

if(result._id){
    return res.json({status: "success", message: "New ticket has been created"})
}



    // insert in mongodb

    res.json({ status: 'error', message: "Unable to create the ticket. Please try again later" });



    } catch(error) {
        res.json({ status: 'error', message: error.message });


    }
})

// Get all tickets for a specific user

router.get("/:_id", userAuth, async(req, res) => {
    console.log(req.params)

    try{

        const {_id} = req.params
            // retrrive new ticket data
    const { sender, subject, message } = req.body;

    const clientId = req.user._id;

   
    const result = await getTicketById(clientId, _id);
 


    return res.json({status: "success", result})



   // insert in mongodb

  



    } catch(error) {
        res.json({ status: 'error', message: error.message });


    }
})


module.exports = router;
