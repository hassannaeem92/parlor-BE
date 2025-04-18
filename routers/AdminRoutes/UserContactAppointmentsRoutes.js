const app = require("express");
const userContactAppointmentRoutes = app.Router();

const auth = require("../../utils/auth");
const {
    getContacts,
    getContactById
} = require("../../controllers/AdminControllers/UserContactAppointmentsControllers");

// vendorRouter.post("/admin/add-vendor", auth, addVendor);
// vendorRouter.get("/admin/get-vendors", auth, getVendors);
// vendorRouter.post("/admin/delete-multiple-vendors", auth, delMultipleVendors);
// vendorRouter.get("/admin/get-specific-vendor/:id", auth, getSpecificVendor);
// vendorRouter.post("/admin/update-vendor/:id", auth, updateVendor);
userContactAppointmentRoutes.get("/admin/getContacts", auth, getContacts);
userContactAppointmentRoutes.get("/admin/getContanctById/:id", auth, getContactById);



module.exports = userContactAppointmentRoutes;
