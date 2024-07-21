const express = require("express");
const router = express.Router();
const {insertTicket, getTickets, getTicketById, updateClientReply, updateStatusClose, deleteTicket} = require('../model/ticket/Ticket.model')
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

router.get("/", userAuth, async(req, res) => {
    
    try{

        const userId = req.user._id;
        const result = await getTickets(userId);      
    

    return res.json({status: "success", result})

    } catch(error) {
        res.json({ status: 'error', message: error.message });


    }
})

// Get all tickets for a specific user

router.get("/:_id", userAuth, async(req, res) => {
    console.log(req.params)
    try{

        const {_id} = req.params
          
    const clientId = req.user._id;

   
    const result = await getTicketById(clientId, _id);

    return res.json({status: "success", result})

    } catch(error) {
        res.json({ status: 'error', message: error.message });


    }
})


// update reply message from client

router.put("/:_id", userAuth, async (req, res) => {
    try {
      const { message, sender } = req.body;
      const { _id } = req.params;
  
      const result = await updateClientReply({ _id, message, sender });
  
      if (result) {
        return res.json({ status: "success", message: "Your message has been updated" });
      }
  
      return res.status(404).json({ status: "error", message: "Ticket not found or unable to update" });
  
    } catch (error) {
      console.error("Error in update route:", error);
      res.status(500).json({ status: 'error', message: "Internal server error" });
    }
  });

  // Update ticket status to close
router.patch("/close-ticket/:_id", userAuth, async (req, res) => {
    try {
   
      const { _id } = req.params;
      const clientId = req.user._id;
  
      const result = await updateStatusClose({ _id, clientId });
  
      if (result._id) {
        return res.json({ status: "success", message: "The ticket has been closed"});
      }
  
      return res.status(404).json({ status: "error", message: "Ticket not found or unable to update" });
  
    } catch (error) {
      console.error("Error in update route:", error);
      res.status(500).json({ status: 'error', message: "Internal server error" });
    }
  });

  //Delete
router.delete("/close-ticket/:_id", userAuth, async (req, res) => {
    try {
   
      const { _id } = req.params;
      const clientId = req.user._id;
  
      const result = await deleteTicket({ _id, clientId });
      
      if (result) {
        return res.json({ status: "success", message: "The ticket has been deleted", deletedTicket: result });
      } else {
        return res.status(404).json({ status: "error", message: "Ticket not found or you don't have permission to delete it" });
      }
  
     
    } catch (error) {
      console.error("Error in update route:", error);
      res.status(500).json({ status: 'error', message: "Internal server error" });
    }
  });


module.exports = router;
