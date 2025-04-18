const app = require("express");
const { 
    addContact,
    getContacts,
    getContactById
 } = require("../controllers/ClientContactControllers");

const clientContactRouter = app.Router();

clientContactRouter.post("/api/addContact", addContact);
// clientContactRouter.get("/api/getContacts", getContacts);
// clientContactRouter.get("/api/getContanctById/:id", getContactById);

module.exports = clientContactRouter;
