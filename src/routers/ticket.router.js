const express = require("express");
const router = express.Router();
const {insertTicket} = require('../model/ticket/Ticket.model')


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

router.post("/", async(req, res) => {

    try{
            // retrrive new ticket data
    const { sender, subject, message } = req.body;

    const ticketObj = {
        clientId: "66995ffa26f69a7935b59fa0",
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



module.exports = router;
