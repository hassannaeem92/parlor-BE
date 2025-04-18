const app = require("express");
const purchaseRouter = app.Router();

const auth = require("../../utils/auth");

const {
  getPurchases,
  changePurchaseStatus,
  addPurchase,
  getSpecificPurchase,
  updatePurchase,
} = require("../../controllers/AdminControllers/PurchaseControllers");

purchaseRouter.get("/admin/get-purchases", auth, getPurchases);
purchaseRouter.post(
  "/admin/change-purchase-status",
  auth,
  changePurchaseStatus
);
purchaseRouter.post("/admin/add-purchase", auth, addPurchase);
purchaseRouter.get(
  "/admin/get-specific-purchase/:id",
  auth,
  getSpecificPurchase
);
purchaseRouter.post("/admin/update-purchase/:id", auth, updatePurchase);

module.exports = purchaseRouter;
