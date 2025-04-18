const app = require("express");
const orderRouter = app.Router();

const auth = require("../../utils/auth");
const {
  getOrders,
  changeOrderStatus,
  addOrder,
  getSpecificOrders,
  updateOrder,
  delMultipleOrders,
  changeOrderPaymentStatus,
} = require("../../controllers/AdminControllers/OrdersControllers");

orderRouter.get("/admin/get-orders", auth, getOrders);
orderRouter.post("/admin/change-order-status", auth, changeOrderStatus);
orderRouter.post(
  "/admin/change-order-payment-status",
  auth,
  changeOrderPaymentStatus
);
orderRouter.post("/admin/add-order", auth, addOrder);
orderRouter.get("/admin/get-specific-order/:id", auth, getSpecificOrders);
orderRouter.post("/admin/update-order/:id", auth, updateOrder);
orderRouter.post("/admin/delete-multiple-orders", auth, delMultipleOrders);

module.exports = orderRouter;
