const app = require("express");
const clientCheckoutRouter = app.Router();

const auth = require("../utils/auth");
const {
  checkoutUserOrder,
  verifyPayment,
} = require("../controllers/ClientCheckoutControllers");

clientCheckoutRouter.post("/api/checkout-user-order", auth, checkoutUserOrder);
clientCheckoutRouter.post("/api/verify-payment", auth, verifyPayment);

module.exports = clientCheckoutRouter;
