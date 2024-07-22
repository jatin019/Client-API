const {TicketSchema} = require('./Ticket.schema')

const insertTicket = ticketObj => {
    return new Promise((resolve, reject) => {
        try{

            TicketSchema(ticketObj)
            .save()
            .then((data) => resolve(data))
            .catch((error) => reject(error))


        } catch(error){
            reject(error)

        }
    })
}
const getTickets = (clientId) => {
    return new Promise((resolve, reject) => {
        try{

            TicketSchema
            .find({clientId})
            .then((data) => resolve(data))
            .catch((error) => reject(error))


        } catch(error){
            reject(error)

        }
    })
}
const getTicketById = (clientId, _id) => {
    return new Promise((resolve, reject) => {
        try{

            TicketSchema
            .find({clientId, _id})
            .then((data) => resolve(data))
            .catch((error) => reject(error))


        } catch(error){
            reject(error)

        }
    })
}
const updateClientReply = async ({ _id, message, sender }) => {
  try {
    const result = await TicketSchema.findOneAndUpdate(
      { _id },
      {
        status: "Pending operator response",
        $push : {
          conversations : {message, sender}
        }
        
      },
      { new: true }
    );
    return result;
  } catch (error) {

    throw error;
  }
};
const updateStatusClose = async ({ _id, clientId }) => {
  try {
    const result = await TicketSchema.findOneAndUpdate(
      { _id, clientId },
      {
        status: "Closed",
        
      },
      { new: true }
    );
    return result;
  } catch (error) {

    throw error;
  }
};

const deleteTicket = async ({ _id, clientId }) => {
  try {
    const result = await TicketSchema.findOneAndDelete(
      { _id, clientId },
      
    );
    return result;
  } catch (error) {

    throw error;
  }
};
module.exports = {
    insertTicket,
    getTickets,
    getTicketById,
    updateClientReply,
    updateStatusClose,
    deleteTicket
}
