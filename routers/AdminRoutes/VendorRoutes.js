const app = require("express");
const vendorRouter = app.Router();

const auth = require("../../utils/auth");
const {
  addVendor,
  getVendors,
  delMultipleVendors,
  getSpecificVendor,
  updateVendor,
} = require("../../controllers/AdminControllers/VendorControllers");

vendorRouter.post("/admin/add-vendor", auth, addVendor);
vendorRouter.get("/admin/get-vendors", auth, getVendors);
vendorRouter.post("/admin/delete-multiple-vendors", auth, delMultipleVendors);
vendorRouter.get("/admin/get-specific-vendor/:id", auth, getSpecificVendor);
vendorRouter.post("/admin/update-vendor/:id", auth, updateVendor);

module.exports = vendorRouter;
