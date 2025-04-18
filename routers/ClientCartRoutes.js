const app = require("express");
const clientCartRouter = app.Router();

const auth = require("../utils/auth");
const {
  addItemToCart,
  getUserCartItem,
  removeUserCartItem,
  increaseUserCartItemQty,
  decreaseUserCartItemQty,
} = require("../controllers/ClientCartControllers");

clientCartRouter.post("/api/add-item-to-cart", auth, addItemToCart);
clientCartRouter.get("/api/get-user-cart-item", getUserCartItem);
clientCartRouter.get(
  "/api/remove-user-cart-item/:id",
  auth,
  removeUserCartItem
);
clientCartRouter.get(
  "/api/increase-user-cart-item-qty/:id",
  auth,
  increaseUserCartItemQty
);
clientCartRouter.get(
  "/api/decrease-user-cart-item-qty/:id",
  auth,
  decreaseUserCartItemQty
);

module.exports = clientCartRouter;
