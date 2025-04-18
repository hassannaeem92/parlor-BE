const app = require("express");
const clientChargesRouter = app.Router();
const { getCharges } = require("../controllers/ClientChargesControllers");

clientChargesRouter.get("/api/get-charges", getCharges);
module.exports = clientChargesRouter;
