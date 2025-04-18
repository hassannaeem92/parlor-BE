const app = require("express");
const clientOrderRouter = app.Router();

const { getOrders } = require("../controllers/ClientOrderControllers");

clientOrderRouter.get("/api/get-user-orders/:id", getOrders);

module.exports = clientOrderRouter;
