const app = require("express");
const HomeSectionAdminRoutes = app.Router();
const upload = require("./../../middlewares/upload");
const auth = require("../../utils/auth");
const {
    addOurWorkSection,
    getOurWorkSection
} = require("../../controllers/AdminControllers/HomeSectionAdminControllers");

HomeSectionAdminRoutes.post("/admin/addOurWorkSection",auth, upload.array('files', 20), addOurWorkSection);
// customerRouter.post("/admin/add-customer", auth, addCustomer);
HomeSectionAdminRoutes.get("/admin/getOurWorkSection", auth, getOurWorkSection);
// customerRouter.post(
//   "/admin/delete-multiple-customers",
//   auth,
//   delMultipleCustomers
// );
// customerRouter.get(
//   "/admin/get-specific-customer/:id",
//   auth,
//   getSpecificCustomer
// );
// customerRouter.post("/admin/update-customer/:id", auth, updateCustomer);

module.exports = HomeSectionAdminRoutes;
