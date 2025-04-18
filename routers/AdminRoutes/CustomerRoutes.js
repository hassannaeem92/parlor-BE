const app = require("express");
const customerRouter = app.Router();

const auth = require("../../utils/auth");
const {
  delMultipleCustomers,
  addCustomer,
  getSpecificCustomer,
  updateCustomer,
  getCustomers,
} = require("../../controllers/AdminControllers/CustomerControllers");

customerRouter.post("/admin/add-customer", auth, addCustomer);
customerRouter.get("/admin/get-customers", auth, getCustomers);
customerRouter.post(
  "/admin/delete-multiple-customers",
  auth,
  delMultipleCustomers
);
customerRouter.get(
  "/admin/get-specific-customer/:id",
  auth,
  getSpecificCustomer
);
customerRouter.post("/admin/update-customer/:id", auth, updateCustomer);

module.exports = customerRouter;
